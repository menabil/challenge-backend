const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    email: {
      type: String, // লগইন করা ইউজারের email
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    doctorName: {
      type: String,
      required: true,
      trim: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    medicalReportImageUrl: {
      type: String, // Cloudinary secure_url
      required: true,
    },
    medicalReportImagePublicId: {
      type: String, // Cloudinary public_id, delete করার সময় দরকার হবে
      required: true,
    },
    serialNumber: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
