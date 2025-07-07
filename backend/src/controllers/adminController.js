import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, "-password");
        res.status(200).json({
            message: "Users fetched successfully",
            users : users
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: "Failed to fetch users." });
    }
};

export const getUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId, "-password");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json({
            message: "User fetched successfully",
            user: user
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Failed to fetch user." });
    }
};

export const promote = async (req, res) => {
    try {
        const userId = req.params.id;
        const toRole = req.body.role || "manager";
        const user = await User.findByIdAndUpdate(
            userId,
            { role: toRole }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json({ message: `User - ${user.name} promoted from ${user.role} to ${toRole}.` });
    } catch (error) {
        console.error("Error promoting user:", error);
        return res.status(500).json({ message: "Failed to promote user." });
    }
};

export const demote = async (req, res) => {
    try {
        const userId = req.params.id;
        const toRole = req.body.role || "user";
        const user = await User.findByIdAndUpdate(
            userId,
            { role: toRole }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json({ message: `User - ${user.name} demoted from ${user.role} to ${toRole}.` });
    } catch (error) {
        console.error("Error demoting user:", error);
        return res.status(500).json({ message: "Failed to demote user." });
    }
};
