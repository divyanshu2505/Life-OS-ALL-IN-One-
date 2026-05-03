import crypto from "crypto";
import Razorpay from "razorpay";
import Booking from "../models/Booking.js";
import Profile from "../models/Profile.js";

function getRazorpayClient() {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return null;
  }

  return new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
  });
}

function canAccessBooking(booking, user) {
  return (
    booking.client.equals(user._id) ||
    booking.provider.equals(user._id) ||
    user.role === "admin"
  );
}

export async function createBookingOrder(req, res) {
  const { providerProfileId, startTime, durationHours, notes } = req.body;

  if (!providerProfileId || !startTime || !durationHours) {
    return res
      .status(400)
      .json({ message: "Provider profile, start time, and duration are required." });
  }

  const providerProfile = await Profile.findOne({
    _id: providerProfileId,
    role: "provider",
    status: "approved",
    isVisible: true
  });

  if (!providerProfile) {
    return res.status(404).json({ message: "Selected provider is unavailable." });
  }

  const duration = Math.max(1, Number(durationHours));
  const totalPrice = providerProfile.pricePerHour * duration;

  const booking = await Booking.create({
    client: req.user._id,
    provider: providerProfile.user,
    providerProfile: providerProfile._id,
    startTime,
    durationHours: duration,
    totalPrice,
    notes: notes || "",
    status: "pending_payment",
    paymentStatus: "unpaid",
    chatEnabled: false
  });

  const razorpay = getRazorpayClient();

  if (!razorpay && process.env.ENABLE_DEV_AUTOCONFIRM === "true") {
    // This keeps the demo usable locally when Razorpay keys are not configured.
    booking.status = "confirmed";
    booking.paymentStatus = "paid";
    booking.chatEnabled = true;
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("providerProfile")
      .populate("provider", "email role")
      .populate("client", "email role");

    return res.status(201).json({
      message: "Booking auto-confirmed in local demo mode.",
      booking: populatedBooking,
      razorpayEnabled: false
    });
  }

  if (!razorpay) {
    return res.status(500).json({
      message: "Razorpay is not configured. Add test keys or enable local auto-confirm."
    });
  }

  const order = await razorpay.orders.create({
    amount: Math.round(totalPrice * 100),
    currency: "INR",
    receipt: `booking_${booking._id}`,
    notes: {
      bookingId: String(booking._id),
      clientId: String(req.user._id),
      providerId: String(providerProfile.user)
    }
  });

  booking.razorpayOrderId = order.id;
  await booking.save();

  res.status(201).json({
    booking,
    order,
    razorpayEnabled: true,
    keyId: process.env.RAZORPAY_KEY_ID
  });
}

export async function verifyBookingPayment(req, res) {
  const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const booking = await Booking.findById(bookingId)
    .populate("providerProfile")
    .populate("provider", "email role")
    .populate("client", "email role");

  if (!booking || !booking.client._id.equals(req.user._id)) {
    return res.status(404).json({ message: "Booking not found." });
  }

  const razorpay = getRazorpayClient();

  if (!razorpay && process.env.ENABLE_DEV_AUTOCONFIRM === "true") {
    return res.json({
      message: "Booking is already confirmed in local demo mode.",
      booking
    });
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Payment verification failed." });
  }

  booking.status = "confirmed";
  booking.paymentStatus = "paid";
  booking.chatEnabled = true;
  booking.razorpayOrderId = razorpay_order_id;
  booking.razorpayPaymentId = razorpay_payment_id;
  await booking.save();

  res.json({
    message: "Payment verified and booking confirmed.",
    booking
  });
}

export async function getMyBookings(req, res) {
  const query =
    req.user.role === "client"
      ? { client: req.user._id }
      : req.user.role === "provider"
        ? { provider: req.user._id }
        : {};

  const bookings = await Booking.find(query)
    .sort({ startTime: 1 })
    .populate("provider", "email role")
    .populate("client", "email role")
    .populate("providerProfile");

  res.json({ bookings });
}

export async function updateBookingStatus(req, res) {
  const { bookingId } = req.params;
  const { status } = req.body;

  const booking = await Booking.findById(bookingId)
    .populate("providerProfile")
    .populate("provider", "email role")
    .populate("client", "email role");

  if (!booking || !canAccessBooking(booking, req.user)) {
    return res.status(404).json({ message: "Booking not found." });
  }

  if (!["confirmed", "completed", "cancelled"].includes(status)) {
    return res.status(400).json({ message: "Unsupported booking status." });
  }

  if (
    status === "completed" &&
    !booking.provider._id.equals(req.user._id) &&
    req.user.role !== "admin"
  ) {
    return res
      .status(403)
      .json({ message: "Only the provider or admin can mark a session as completed." });
  }

  if (status === "confirmed" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admin can manually confirm bookings." });
  }

  booking.status = status;

  if (status === "cancelled") {
    booking.chatEnabled = false;
  }

  if (status === "confirmed" && booking.paymentStatus === "paid") {
    booking.chatEnabled = true;
  }

  await booking.save();

  res.json({
    message: `Booking marked as ${status}.`,
    booking
  });
}
