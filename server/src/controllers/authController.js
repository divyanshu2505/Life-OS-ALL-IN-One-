import Profile from "../models/Profile.js";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

function cleanUser(user, profile) {
  return {
    id: user._id,
    email: user.email,
    role: user.role,
    isAdultConfirmed: user.isAdultConfirmed,
    blockedUsers: (user.blockedUsers || []).map((blockedUserId) => String(blockedUserId)),
    profileCompleted: Boolean(profile),
    profileStatus: profile?.status || null,
    profile
  };
}

async function buildAuthPayload(user) {
  const profile = await Profile.findOne({ user: user._id }).lean();

  return {
    token: generateToken(user._id),
    user: cleanUser(user, profile)
  };
}

export async function signup(req, res) {
  const { email, password, role, isAdultConfirmed } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "Email, password, and role are required." });
  }

  if (!["client", "provider"].includes(role)) {
    return res.status(400).json({ message: "Invalid account role." });
  }

  if (!isAdultConfirmed) {
    return res.status(400).json({ message: "You must confirm that you are 18 or older." });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  const user = await User.create({
    email,
    password,
    role,
    isAdultConfirmed
  });

  const payload = await buildAuthPayload(user);
  res.status(201).json(payload);
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const payload = await buildAuthPayload(user);
  res.json(payload);
}

export async function getMe(req, res) {
  const profile = await Profile.findOne({ user: req.user._id }).lean();
  res.json({ user: cleanUser(req.user, profile) });
}

export async function blockUser(req, res) {
  const { userId } = req.params;

  if (String(req.user._id) === userId) {
    return res.status(400).json({ message: "You cannot block your own account." });
  }

  const targetUser = await User.findById(userId).select("_id");

  if (!targetUser) {
    return res.status(404).json({ message: "User not found." });
  }

  const alreadyBlocked = req.user.blockedUsers.some(
    (blockedUserId) => String(blockedUserId) === userId
  );

  if (!alreadyBlocked) {
    req.user.blockedUsers.push(userId);
    await req.user.save();
  }

  const profile = await Profile.findOne({ user: req.user._id }).lean();
  res.json({
    message: "User blocked successfully.",
    user: cleanUser(req.user, profile)
  });
}
