import express from "express";
import { getMessages, sendMessage } from "../controllers/chatController.js";
import { authenticate } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/:bookingId/messages", authenticate, asyncHandler(getMessages));
router.post("/:bookingId/messages", authenticate, asyncHandler(sendMessage));

export default router;
