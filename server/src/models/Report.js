import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null
    },
    reason: {
      type: String,
      enum: ["harassment", "fake-profile", "safety", "spam", "other"],
      required: true
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    status: {
      type: String,
      enum: ["open", "reviewed", "resolved"],
      default: "open"
    }
  },
  {
    timestamps: true
  }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;
