import express from "express";
const router = express.Router();

import {
  joinQueue,
  leaveQueue,
  cancelQueue,
  getQueuesByRoom,
  get_user_queues,
  kickFromQueue
} from "../controllers/queueController.js";

import verifySession from "../middlewares/verifySession.js";
import roleCheck from "../middlewares/roleCheck.js";

router.post("/room/:roomId/join", verifySession, joinQueue);
router.post("/room/:roomId/leave", verifySession, leaveQueue);
router.get("/room/:roomId", verifySession, getQueuesByRoom);
router.get("/user/:userId", verifySession, get_user_queues);

router.delete("/kick/:queueId", verifySession, roleCheck(["owner", "admin"]), kickFromQueue);
router.post("/cancel", verifySession, cancelQueue);

export default router;