import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    role: {
      type: String,
      enum: ["client", "provider"],
      required: true
    },
    displayName: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: Number,
      min: 18,
      required: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    headline: {
      type: String,
      trim: true,
      default: ""
    },
    bio: {
      type: String,
      trim: true,
      default: ""
    },
    interests: {
      type: [String],
      default: []
    },
    languages: {
      type: [String],
      default: []
    },
    photoUrl: {
      type: String,
      default: ""
    },
    pricePerHour: {
      type: Number,
      default: 0
    },
    availability: {
      type: [availabilitySchema],
      default: []
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved"
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    ratingAverage: {
      type: Number,
      default: 0
    },
    isVisible: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

profileSchema.index({ role: 1, status: 1 });
profileSchema.index({ pricePerHour: 1, ratingAverage: -1 });

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
