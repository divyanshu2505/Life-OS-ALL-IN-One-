import express from "express";
import { createReview } from "../controllers/reviewController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/", authenticate, authorize("client"), asyncHandler(createReview));

export default router;
