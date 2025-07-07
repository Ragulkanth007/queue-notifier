import express from 'express';
const router = express.Router();
import { googleLogin, getRole, verifyToken } from '../controllers/authController.js';
import { googleLoginSchema, getRoleSchema } from '../validation/auth.js';
import { validateBody } from '../validation/validateBody.js';

router.post(
  "/google-login",
  validateBody(googleLoginSchema),
  googleLogin
);
router.post(
  "/get-role",
  validateBody(getRoleSchema),
  getRole
);
router.get("/verify-token", verifyToken);

export default router;