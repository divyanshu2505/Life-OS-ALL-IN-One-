import Booking from "../models/Booking.js";
import Profile from "../models/Profile.js";
import Review from "../models/Review.js";

async function refreshProfileRating(providerProfileId) {
  const aggregates = await Review.aggregate([
    { $match: { providerProfile: providerProfileId } },
    {
      $group: {
        _id: "$providerProfile",
        reviewCount: { $sum: 1 },
        ratingAverage: { $avg: "$rating" }
      }
    }
  ]);

  const summary = aggregates[0] || { reviewCount: 0, ratingAverage: 0 };

  await Profile.findByIdAndUpdate(providerProfileId, {
    reviewCount: summary.reviewCount,
    ratingAverage: Number(summary.ratingAverage.toFixed(1))
  });
}

export async function createReview(req, res) {
  const { bookingId, rating, comment } = req.body;
  const booking = await Booking.findById(bookingId);

  if (!booking || !booking.client.equals(req.user._id)) {
    return res.status(404).json({ message: "Booking not found." });
  }

  if (booking.paymentStatus !== "paid") {
    return res.status(400).json({ message: "Only paid bookings can be reviewed." });
  }

  const existingReview = await Review.findOne({ booking: booking._id });

  if (existingReview) {
    return res.status(409).json({ message: "This booking has already been reviewed." });
  }

  const review = await Review.create({
    booking: booking._id,
    client: req.user._id,
    provider: booking.provider,
    providerProfile: booking.providerProfile,
    rating,
    comment
  });

  await refreshProfileRating(booking.providerProfile);

  res.status(201).json({
    message: "Review submitted successfully.",
    review
  });
}
