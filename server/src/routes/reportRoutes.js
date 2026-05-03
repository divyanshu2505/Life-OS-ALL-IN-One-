import express from "express";
import { createReport } from "../controllers/reportController.js";
import { authenticate } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/", authenticate, asyncHandler(createReport));

export default router;
