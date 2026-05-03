import express from "express";
import {
  getMyProfile,
  getProviderById,
  listProviders,
  upsertMyProfile
} from "../controllers/profileController.js";
import { authenticate } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/me", authenticate, asyncHandler(getMyProfile));
router.post("/me", authenticate, upload.single("photo"), asyncHandler(upsertMyProfile));
router.get("/providers", asyncHandler(listProviders));
router.get("/providers/:profileId", asyncHandler(getProviderById));

export default router;
