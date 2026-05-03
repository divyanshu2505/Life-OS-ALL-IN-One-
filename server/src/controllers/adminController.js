import Booking from "../models/Booking.js";
import Profile from "../models/Profile.js";
import Report from "../models/Report.js";
import User from "../models/User.js";

export async function getOverview(req, res) {
  const [usersCount, providersPending, bookingsCount, openReportsCount, pendingProfiles, recentBookings] =
    await Promise.all([
      User.countDocuments(),
      Profile.countDocuments({ role: "provider", status: "pending" }),
      Booking.countDocuments(),
      Report.countDocuments({ status: "open" }),
      Profile.find({ role: "provider", status: "pending" }).sort({ createdAt: 1 }).limit(8),
      Booking.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .populate("provider", "email role")
        .populate("client", "email role")
        .populate("providerProfile")
    ]);

  res.json({
    stats: {
      usersCount,
      providersPending,
      bookingsCount,
      openReportsCount
    },
    pendingProfiles,
    recentBookings
  });
}

export async function listUsers(req, res) {
  const users = await User.find().sort({ createdAt: -1 }).select("-password").lean();
  const profiles = await Profile.find({
    user: { $in: users.map((user) => user._id) }
  }).lean();

  const profileMap = new Map(profiles.map((profile) => [String(profile.user), profile]));
  const mergedUsers = users.map((user) => ({
    ...user,
    profile: profileMap.get(String(user._id)) || null
  }));

  res.json({ users: mergedUsers });
}

export async function moderateProviderProfile(req, res) {
  const { profileId } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Status must be approved or rejected." });
  }

  const profile = await Profile.findOneAndUpdate(
    { _id: profileId, role: "provider" },
    { status },
    { new: true }
  );

  if (!profile) {
    return res.status(404).json({ message: "Provider profile not found." });
  }

  res.json({
    message: `Provider profile ${status}.`,
    profile
  });
}

export async function listBookings(req, res) {
  const bookings = await Booking.find()
    .sort({ startTime: -1 })
    .populate("provider", "email role")
    .populate("client", "email role")
    .populate("providerProfile");

  res.json({ bookings });
}

export async function listReports(req, res) {
  const reports = await Report.find()
    .sort({ createdAt: -1 })
    .populate("reporter", "email role")
    .populate("reportedUser", "email role")
    .populate("booking");

  res.json({ reports });
}
