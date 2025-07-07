import Queue from "../models/queue.model.js";
import Room from "../models/room.model.js";

const getQueue = async (roomId) => {
  return await Queue.find({ roomId: roomId })
    .sort("position")
    .populate("userId", "name email image");
};

export const joinQueue = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roomId } = req.params;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    const existingEntry = await Queue.findOne({
      roomId: roomId,
      userId: userId,
    });
    if (existingEntry) {
      return res.status(400).json({ error: "User already in queue" });
    }

    const position =
      (await Queue.countDocuments({ roomId: roomId, status: "waiting" })) + 1;

    const addUserToRoom = await Room.findByIdAndUpdate(
      roomId,
      { $addToSet: { usersInRoom: userId }, $inc: { queueCount: 1 } },
      { new: true }
    );

    const newEntry = await Queue.create({
      userId: userId,
      roomId: roomId,
      position,
      joinedAt: new Date(),
    });
    console.log("New queue entry created:", newEntry);

    // Emit to all users in the room
    const updatedQueue = await getQueue(roomId);
    if (req.io) {
      req.io.to(roomId.toString()).emit("queue:update", {
        message: "Queue updated",
        roomId: roomId,
        queue: updatedQueue,
        action: "join",
        userId: userId
      });

      // Also emit to general room for dashboard updates
      req.io.emit("queue:room:update", {
        roomId: roomId,
        queue: updatedQueue
      });
    }

    res.status(201).json({
      message: "User joined queue",
      position,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const leaveQueue = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roomId } = req.params;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    const removed = await Queue.findOneAndDelete({
      roomId,
      userId,
      status: "waiting"
    });

    if (!removed) {
      return res.status(400).json({ error: "User not in queue" });
    }

    const entries = await Queue.find({ roomId, status: "waiting" }).sort("joinedAt");
    const bulkOps = entries.map((entry, index) => ({
      updateOne: {
        filter: { _id: entry._id },
        update: { $set: { position: index + 1 } }
      }
    }));
    if (bulkOps.length > 0) await Queue.bulkWrite(bulkOps);

    // Update room queue count
    await Room.findByIdAndUpdate(
      roomId,
      { $pull: { usersInRoom: userId }, $inc: { queueCount: -1 } },
      { new: true }
    );

    const updatedQueue = await getQueue(roomId);
    req.io.to(roomId.toString()).emit("queue:update", {
      message: "Queue updated",
      roomId,
      queue: updatedQueue,
      action: "leave",
      userId: userId
    });

    // Also emit to general room for dashboard updates
    req.io.emit("queue:room:update", {
      roomId: roomId,
      queue: updatedQueue
    });

    res.status(200).json({ message: "User left queue" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const kickFromQueue = async (req, res) => {
  const { queueId } = req.params;

  if (!queueId) return res.status(400).json({ message: "queueId required" });

  try {
    const queue = await Queue.findById(queueId);
    if (!queue) return res.status(404).json({ message: "Queue not found" });

    const roomId = queue.roomId;
    const kickedUserId = queue.userId;
    
    await Queue.findByIdAndDelete(queueId);

    const entries = await Queue.find({ roomId, status: "waiting" }).sort("joinedAt");
    const bulkOps = entries.map((entry, index) => ({
      updateOne: {
        filter: { _id: entry._id },
        update: { $set: { position: index + 1 } }
      }
    }));
    if (bulkOps.length > 0) await Queue.bulkWrite(bulkOps);

    if (req.io && roomId) {
      const updatedQueue = await getQueue(roomId);
      req.io.to(roomId.toString()).emit("queue:update", {
        message: "Queue updated",
        roomId,
        queue: updatedQueue,
        action: "kick",
        kickedUserId: kickedUserId
      });

      // Also emit to general room for dashboard updates
      req.io.emit("queue:room:update", {
        roomId: roomId,
        queue: updatedQueue
      });
    }
    
    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      {
        $inc: { queueCount: -1 },
        $pull: { usersInRoom: kickedUserId }
      },
      { new: true }
    );

    res.status(200).json({
      message: "User kicked from queue",
      updatedRoom: updatedRoom
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const cancelQueue = async (req, res) => {
  const { queueId } = req.body;
  const userRole = req.user.role;
  const userId = req.user.id;

  if (!queueId) return res.status(400).json({ message: "queueId required" });

  try {
    const queue = await Queue.findById(queueId);
    if (!queue) return res.status(404).json({ message: "Queue not found" });

    // permission - allow admin, owner, or the user who created the queue entry
    if (
      userRole !== "admin" &&
      userRole !== "owner" &&
      queue.userId.toString() !== userId
    ) {
      return res.status(403).json({ message: "You do not have permission" });
    }

    const roomId = queue.roomId;
    const cancelledUserId = queue.userId;

    await Queue.findByIdAndDelete(queueId);

    // Reorder remaining queue positions
    const entries = await Queue.find({ roomId, status: "waiting" }).sort("joinedAt");
    const bulkOps = entries.map((entry, index) => ({
      updateOne: {
        filter: { _id: entry._id },
        update: { $set: { position: index + 1 } }
      }
    }));
    if (bulkOps.length > 0) await Queue.bulkWrite(bulkOps);

    // Update room queue count
    await Room.findByIdAndUpdate(
      roomId,
      { $pull: { usersInRoom: cancelledUserId }, $inc: { queueCount: -1 } },
      { new: true }
    );

    // Emit queue update
    if (req.io && roomId) {
      const updatedQueue = await getQueue(roomId);
      req.io.to(roomId.toString()).emit("queue:update", {
        message: "Queue updated",
        roomId,
        queue: updatedQueue,
        action: "cancel",
        cancelledUserId: cancelledUserId
      });

      // Also emit to general room for dashboard updates
      req.io.emit("queue:room:update", {
        roomId: roomId,
        queue: updatedQueue
      });
    }

    res.status(200).json({ message: "Queue cancelled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getQueuesByRoom = async (req, res) => {
  const { roomId } = req.params;

  if (!roomId) {
    return res.status(400).json({ message: "roomId required" });
  }

  try {
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const queues = await Queue.find({ roomId, status: "waiting" })
      .populate('userId')
      .sort({ position: 1 });
      console.log("Queues:", queues);

    return res.status(200).json({
      message: "Queues fetched successfully",
      queue: queues,
      room: room
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const get_user_queues =  async (req, res) => {
  try {
    const requestedUserId = req.params.userId;
    const loggedInUserId = req.user.id;

    if (requestedUserId !== loggedInUserId) {
      return res.status(403).json({ message: "Unauthorized to view these queues." });
    }

    const queues = await Queue.find({ userId: requestedUserId })
      .populate("roomId", "name");

    const formatted = queues.map(q => ({
      _id: q._id,
      roomId: q.roomId._id,
      roomName: q.roomId.name,
      status: q.status,
      position: q.position
    }));

    res.status(200).json({ queues: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};