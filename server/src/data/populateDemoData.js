import Booking from "../models/Booking.js";
import Message from "../models/Message.js";
import Profile from "../models/Profile.js";
import Report from "../models/Report.js";
import Review from "../models/Review.js";
import User from "../models/User.js";

export async function populateDemoData({ reset = false } = {}) {
  if (reset) {
    await Promise.all([
      Message.deleteMany({}),
      Review.deleteMany({}),
      Booking.deleteMany({}),
      Report.deleteMany({}),
      Profile.deleteMany({}),
      User.deleteMany({})
    ]);
  } else {
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      return { seeded: false };
    }
  }

  const [admin, client, providerOne, providerTwo, providerPending] = await User.create([
    {
      email: "admin@companioncircle.local",
      password: "Test@123",
      role: "admin",
      isAdultConfirmed: true
    },
    {
      email: "client@example.com",
      password: "Test@123",
      role: "client",
      isAdultConfirmed: true
    },
    {
      email: "aarav@example.com",
      password: "Test@123",
      role: "provider",
      isAdultConfirmed: true
    },
    {
      email: "vivaan@example.com",
      password: "Test@123",
      role: "provider",
      isAdultConfirmed: true
    },
    {
      email: "ishaan@example.com",
      password: "Test@123",
      role: "provider",
      isAdultConfirmed: true
    }
  ]);

  const [, providerProfileOne, providerProfileTwo] = await Profile.create([
    {
      user: client._id,
      role: "client",
      displayName: "Maya",
      age: 24,
      location: "New Delhi",
      headline: "Weekend coffee chats and movie reviews",
      bio: "Friendly, curious, and looking for lighthearted conversations with respectful boundaries.",
      interests: ["books", "travel", "music"],
      languages: ["English", "Hindi"],
      status: "approved"
    },
    {
      user: providerOne._id,
      role: "provider",
      displayName: "Aarav",
      age: 26,
      location: "Mumbai",
      headline: "Gym buddy, gamer, and uplifting listener",
      bio: "Calm conversationalist who loves multiplayer games, fitness habits, and helping people feel heard.",
      interests: ["gaming", "fitness", "movies"],
      languages: ["English", "Hindi"],
      pricePerHour: 699,
      availability: [
        { day: "Monday", startTime: "18:00", endTime: "22:00" },
        { day: "Wednesday", startTime: "19:00", endTime: "23:00" },
        { day: "Saturday", startTime: "12:00", endTime: "18:00" }
      ],
      status: "approved",
      reviewCount: 1,
      ratingAverage: 4.8
    },
    {
      user: providerTwo._id,
      role: "provider",
      displayName: "Vivaan",
      age: 28,
      location: "Bengaluru",
      headline: "Tech talk, playlists, and thoughtful chats",
      bio: "Easygoing companion for long conversations about startups, playlists, anime, and everyday wins.",
      interests: ["talking", "music", "anime"],
      languages: ["English", "Kannada", "Hindi"],
      pricePerHour: 899,
      availability: [
        { day: "Tuesday", startTime: "18:00", endTime: "21:00" },
        { day: "Friday", startTime: "18:00", endTime: "23:00" },
        { day: "Sunday", startTime: "11:00", endTime: "16:00" }
      ],
      status: "approved",
      reviewCount: 1,
      ratingAverage: 5
    },
    {
      user: providerPending._id,
      role: "provider",
      displayName: "Ishaan",
      age: 25,
      location: "Jaipur",
      headline: "Pending admin approval",
      bio: "Positive, punctual, and excited to meet new people through safe companionship sessions.",
      interests: ["talking", "travel", "gaming"],
      languages: ["English", "Hindi"],
      pricePerHour: 549,
      availability: [{ day: "Sunday", startTime: "15:00", endTime: "20:00" }],
      status: "pending"
    }
  ]);

  const completedBooking = await Booking.create({
    client: client._id,
    provider: providerOne._id,
    providerProfile: providerProfileOne._id,
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    durationHours: 2,
    totalPrice: 1398,
    status: "completed",
    paymentStatus: "paid",
    chatEnabled: true,
    razorpayOrderId: "demo_order_001",
    razorpayPaymentId: "demo_payment_001"
  });

  const confirmedBooking = await Booking.create({
    client: client._id,
    provider: providerTwo._id,
    providerProfile: providerProfileTwo._id,
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    durationHours: 1,
    totalPrice: 899,
    status: "confirmed",
    paymentStatus: "paid",
    chatEnabled: true,
    razorpayOrderId: "demo_order_002",
    razorpayPaymentId: "demo_payment_002"
  });

  await Review.create({
    booking: completedBooking._id,
    client: client._id,
    provider: providerOne._id,
    providerProfile: providerProfileOne._id,
    rating: 5,
    comment: "Warm, respectful, and easy to talk to."
  });

  await Message.create([
    {
      booking: confirmedBooking._id,
      sender: client._id,
      content: "Hi Vivaan, looking forward to tomorrow's session."
    },
    {
      booking: confirmedBooking._id,
      sender: providerTwo._id,
      content: "Same here. Happy to keep it relaxed and fun."
    }
  ]);

  await Report.create({
    reporter: client._id,
    reportedUser: providerPending._id,
    booking: null,
    reason: "fake-profile",
    description: "Please verify the pending profile details before approval."
  });

  return { seeded: true };
}
