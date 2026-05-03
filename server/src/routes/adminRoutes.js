import express from "express";
import {
  getOverview,
  listBookings,
  listReports,
  listUsers,
  moderateProviderProfile
} from "../controllers/adminController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.use(authenticate, authorize("admin"));

router.get("/overview", asyncHandler(getOverview));
router.get("/users", asyncHandler(listUsers));
router.get("/bookings", asyncHandler(listBookings));
router.get("/reports", asyncHandler(listReports));
router.patch("/providers/:profileId/status", asyncHandler(moderateProviderProfile));

export default router;
