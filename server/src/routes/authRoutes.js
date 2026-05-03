import express from "express";
import { blockUser, getMe, login, signup } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/signup", asyncHandler(signup));
router.post("/login", asyncHandler(login));
router.get("/me", authenticate, asyncHandler(getMe));
router.post("/block/:userId", authenticate, asyncHandler(blockUser));

export default router;
