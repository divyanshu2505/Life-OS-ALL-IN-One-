import Report from "../models/Report.js";
import User from "../models/User.js";

export async function createReport(req, res) {
  const { reportedUserId, bookingId, reason, description } = req.body;

  if (!reportedUserId || !reason) {
    return res.status(400).json({ message: "Reported user and reason are required." });
  }

  if (String(req.user._id) === reportedUserId) {
    return res.status(400).json({ message: "You cannot report your own account." });
  }

  const reportedUser = await User.findById(reportedUserId).select("_id");

  if (!reportedUser) {
    return res.status(404).json({ message: "Reported user not found." });
  }

  const report = await Report.create({
    reporter: req.user._id,
    reportedUser: reportedUserId,
    booking: bookingId || null,
    reason,
    description: description || ""
  });

  res.status(201).json({
    message: "Report submitted. Our admin team will review it.",
    report
  });
}
