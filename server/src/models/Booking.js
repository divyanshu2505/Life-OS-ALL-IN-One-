import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    providerProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true
    },
    startTime: {
      type: Date,
      required: true
    },
    durationHours: {
      type: Number,
      min: 1,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    },
    notes: {
      type: String,
      trim: true,
      default: ""
    },
    status: {
      type: String,
      enum: ["pending_payment", "confirmed", "completed", "cancelled"],
      default: "pending_payment"
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid"
    },
    razorpayOrderId: {
      type: String,
      default: ""
    },
    razorpayPaymentId: {
      type: String,
      default: ""
    },
    chatEnabled: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

bookingSchema.index({ client: 1, provider: 1, startTime: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
