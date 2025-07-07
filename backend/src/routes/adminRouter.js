
import { getUsers, getUserById, promote, demote } from "../controllers/adminController.js";

import verifySession from "../middlewares/verifySession.js";
import roleCheck from "../middlewares/roleCheck.js";

import express from "express"
const router = express.Router();

router.get("/users", verifySession, roleCheck(["admin"]), getUsers);
router.get("/user/:id", verifySession, roleCheck(["admin"]), getUserById);
router.post("/promote/:id", verifySession, roleCheck(["admin"]), promote);
router.post("/demote/:id", verifySession, roleCheck(["admin"]), demote);

export default router;
