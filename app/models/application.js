import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    // Personal Information
    fullName: String,
    dateOfBirth: Date,
    gender: String,
    nationality: String,
    // Address Details
    address: String,
    city: String,
    addressState: String,
    pincode: String,
    // Documents (URLs)
    passportPhoto: String,
    aadhaarCard: String,
    birthCertificate: String,
    // Appointment Details
    passportOffice: String,
    appointmentDate: Date,
    timeSlot: String,
    // Application State
    state: {
      type: String,
      enum: ["draft", "submitted"],
      default: "draft",
    },
    // Status Tracking
    status: {
      type: String,
      enum: [
        "submitted",
        "under_review",
        "police_verification",
        "passport_printed",
        "dispatched",
      ],
      default: "submitted",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Application || mongoose.model("Application", applicationSchema);
