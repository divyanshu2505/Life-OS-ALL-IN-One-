import express from "express";
import {
  createBookingOrder,
  getMyBookings,
  updateBookingStatus,
  verifyBookingPayment
} from "../controllers/bookingController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/create-order", authenticate, authorize("client"), asyncHandler(createBookingOrder));
router.post("/verify-payment", authenticate, authorize("client"), asyncHandler(verifyBookingPayment));
router.get("/mine", authenticate, asyncHandler(getMyBookings));
router.patch("/:bookingId/status", authenticate, asyncHandler(updateBookingStatus));

export default router;
