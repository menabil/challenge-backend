const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  createAppointment,
  getAppointmentsByEmail,
  updateAppointmentStatus,
  deleteAppointment,
} = require("../controllers/appointmentController");

// নতুন appointment তৈরি (medical report image সহ, Cloudinary তে আপলোড হবে)
router.post("/", upload.single("medicalReportImage"), createAppointment);

// একজন ইউজারের email দিয়ে তার সব appointment লিস্ট করা
router.get("/:email", getAppointmentsByEmail);

// Appointment এর status update করা (Pending -> Approved/Completed)
router.patch("/:id/status", updateAppointmentStatus);

// নির্দিষ্ট appointment delete করা (DB + Cloudinary image দুটোই)
router.delete("/:id", deleteAppointment);

module.exports = router;
