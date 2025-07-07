
import { createRoom, deleteRoom, getRooms, getRoom, getOwnedRooms } from "../controllers/roomController.js";
import verifySession from "../middlewares/verifySession.js";
import roleCheck from "../middlewares/roleCheck.js";

import express from "express"
const router = express.Router();


router.get("/list", verifySession, getRooms);
router.get("/owned", verifySession, getOwnedRooms);
router.get("/:roomId", verifySession, getRoom);

router.post("/create", verifySession, roleCheck(["owner", "admin"]), createRoom);
router.delete("/:roomId", verifySession, roleCheck(["owner", "admin"]), deleteRoom);

export default router;
