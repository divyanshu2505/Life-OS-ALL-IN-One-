import Profile from "../models/Profile.js";
import Review from "../models/Review.js";

function parseList(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => String(item).trim())
        .filter(Boolean);
    }
  } catch (error) {
    // Fall back to comma-separated parsing.
  }

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseAvailability(value) {
  if (!value) {
    return [];
  }

  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((slot) => ({
        day: String(slot.day || "").trim(),
        startTime: String(slot.startTime || "").trim(),
        endTime: String(slot.endTime || "").trim()
      }))
      .filter((slot) => slot.day && slot.startTime && slot.endTime);
  } catch (error) {
    return [];
  }
}

export async function getMyProfile(req, res) {
  const profile = await Profile.findOne({ user: req.user._id });

  if (!profile) {
    return res.status(404).json({ message: "Profile not found." });
  }

  res.json({ profile });
}

export async function upsertMyProfile(req, res) {
  const existingProfile = await Profile.findOne({ user: req.user._id });
  const role = req.user.role;

  if (!["client", "provider"].includes(role)) {
    return res.status(400).json({ message: "Admins do not manage public profiles." });
  }

  const serverUrl = process.env.SERVER_URL || `${req.protocol}://${req.get("host")}`;
  const interests = parseList(req.body.interests);
  const languages = parseList(req.body.languages);
  const availability = parseAvailability(req.body.availability);
  const pricePerHour = Number(req.body.pricePerHour || 0);
  const status =
    role === "provider"
      ? existingProfile?.status === "rejected"
        ? "pending"
        : existingProfile?.status || "pending"
      : "approved";

  const profileData = {
    user: req.user._id,
    role,
    displayName: req.body.displayName,
    age: Number(req.body.age),
    location: req.body.location,
    headline: req.body.headline || "",
    bio: req.body.bio || "",
    interests,
    languages,
    availability,
    status
  };

  if (role === "provider") {
    profileData.pricePerHour = pricePerHour;
  }

  if (existingProfile) {
    profileData.reviewCount = existingProfile.reviewCount;
    profileData.ratingAverage = existingProfile.ratingAverage;
    profileData.isVisible = existingProfile.isVisible;
  }

  if (req.file) {
    profileData.photoUrl = `${serverUrl}/uploads/${req.file.filename}`;
  } else if (existingProfile?.photoUrl) {
    profileData.photoUrl = existingProfile.photoUrl;
  }

  const profile = await Profile.findOneAndUpdate({ user: req.user._id }, profileData, {
    new: true,
    upsert: true,
    runValidators: true,
    setDefaultsOnInsert: true
  });

  res.json({
    message:
      role === "provider"
        ? "Profile saved. Provider profiles stay visible only after admin approval."
        : "Profile saved successfully.",
    profile
  });
}

export async function listProviders(req, res) {
  const { minPrice, maxPrice, rating, interest, search } = req.query;
  const filters = {
    role: "provider",
    status: "approved",
    isVisible: true
  };

  if (minPrice || maxPrice) {
    filters.pricePerHour = {};
    if (minPrice) {
      filters.pricePerHour.$gte = Number(minPrice);
    }
    if (maxPrice) {
      filters.pricePerHour.$lte = Number(maxPrice);
    }
  }

  if (rating) {
    filters.ratingAverage = { $gte: Number(rating) };
  }

  if (interest) {
    filters.interests = { $in: [String(interest)] };
  }

  if (search) {
    filters.$or = [
      { displayName: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
      { headline: { $regex: search, $options: "i" } },
      { bio: { $regex: search, $options: "i" } }
    ];
  }

  const profiles = await Profile.find(filters).sort({ ratingAverage: -1, createdAt: -1 });
  res.json({ profiles });
}

export async function getProviderById(req, res) {
  const { profileId } = req.params;
  const profile = await Profile.findOne({
    _id: profileId,
    role: "provider",
    status: "approved",
    isVisible: true
  });

  if (!profile) {
    return res.status(404).json({ message: "Provider profile not found." });
  }

  const reviews = await Review.find({ providerProfile: profile._id })
    .sort({ createdAt: -1 })
    .limit(6)
    .populate("client", "email role");

  res.json({ profile, reviews });
}
