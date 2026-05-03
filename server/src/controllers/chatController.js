import Booking from "../models/Booking.js";
import Message from "../models/Message.js";

async function findAccessibleBooking(bookingId, user) {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return null;
  }

  const allowed =
    booking.client.equals(user._id) ||
    booking.provider.equals(user._id) ||
    user.role === "admin";

  if (!allowed) {
    return false;
  }

  return booking;
}

export async function getMessages(req, res) {
  const booking = await findAccessibleBooking(req.params.bookingId, req.user);

  if (booking === null) {
    return res.status(404).json({ message: "Booking not found." });
  }

  if (booking === false) {
    return res.status(403).json({ message: "You do not have access to this chat." });
  }

  if (!booking.chatEnabled && req.user.role !== "admin") {
    return res.status(403).json({ message: "Chat unlocks after payment confirmation." });
  }

  const messages = await Message.find({ booking: booking._id })
    .sort({ createdAt: 1 })
    .populate("sender", "email role");

  res.json({ messages });
}

export async function sendMessage(req, res) {
  const booking = await findAccessibleBooking(req.params.bookingId, req.user);

  if (booking === null) {
    return res.status(404).json({ message: "Booking not found." });
  }

  if (booking === false) {
    return res.status(403).json({ message: "You do not have access to this chat." });
  }

  if (!booking.chatEnabled && req.user.role !== "admin") {
    return res.status(403).json({ message: "Chat unlocks after payment confirmation." });
  }

  if (!req.body.content?.trim()) {
    return res.status(400).json({ message: "Message content cannot be empty." });
  }

  const message = await Message.create({
    booking: booking._id,
    sender: req.user._id,
    content: req.body.content
  });

  const populatedMessage = await Message.findById(message._id).populate("sender", "email role");

  const io = req.app.get("io");
  io.to(`booking:${booking._id}`).emit("chat:message", populatedMessage);

  res.status(201).json({ message: populatedMessage });
}
