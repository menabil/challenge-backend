const cloudinary = require("../config/cloudinary");
const Appointment = require("../models/Appointment");
const sendEmail = require("../utils/sendEmail");

// @desc    নতুন appointment তৈরি করা
// @route   POST /api/appointments
const createAppointment = async (req, res) => {
  try {
    const { email, phone, age, doctorName, appointmentDate } = req.body;

    if (!email || !phone || !age || !doctorName || !appointmentDate) {
      return res
        .status(400)
        .json({ message: "email, phone, age, doctorName and appointmentDate are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Medical report image is required" });
    }

    const normalizedEmail = email.toLowerCase();
    const parsedDate = new Date(appointmentDate);

    // একই email দিয়ে একই doctor এর কাছে একই date এ আগে থেকে বুকিং আছে কি না চেক
    const alreadyBooked = await Appointment.findOne({
      email: normalizedEmail,
      doctorName,
      appointmentDate: parsedDate,
    });

    if (alreadyBooked) {
      // আগে থেকে বুকিং থাকলে Cloudinary তে আপলোড হওয়া ফাইলটা মুছে দেওয়া হচ্ছে
      await cloudinary.uploader.destroy(req.file.filename);
      return res.status(400).json({
        message: `You already have an appointment with Dr. ${doctorName} on this date.`,
      });
    }

    // একই doctor এর একই date এ এখন পর্যন্ত কতগুলো বুকিং আছে সেটা গণনা করে Serial Number বানানো
    const existingCount = await Appointment.countDocuments({
      doctorName,
      appointmentDate: parsedDate,
    });
    const serialNumber = existingCount + 1;

    const appointment = await Appointment.create({
      email: normalizedEmail,
      phone,
      age,
      doctorName,
      appointmentDate: parsedDate,
      medicalReportImageUrl: req.file.path, // Cloudinary secure_url
      medicalReportImagePublicId: req.file.filename, // Cloudinary public_id
      serialNumber,
      status: "Pending",
    });

    // Confirmation email পাঠানো হচ্ছে
    await sendEmail({
      to: normalizedEmail,
      subject: "Appointment Confirmation",
      html: `
        <h2>Appointment Confirmed</h2>
        <p>Your appointment has been booked successfully.</p>
        <ul>
          <li><b>Doctor:</b> ${doctorName}</li>
          <li><b>Date:</b> ${parsedDate.toDateString()}</li>
          <li><b>Serial Number:</b> Serial #${serialNumber}</li>
          <li><b>Status:</b> Pending</li>
        </ul>
      `,
    });

    return res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    একজন ইউজারের সব appointment লিস্ট করা (email দিয়ে)
// @route   GET /api/appointments/:email
const getAppointmentsByEmail = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const appointments = await Appointment.find({ email }).sort({ createdAt: -1 });
    return res.status(200).json({ appointments });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Appointment এর status update করা (Pending -> Approved/Completed)
// @route   PATCH /api/appointments/:id/status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["Pending", "Approved", "Completed"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
      });
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = status;
    await appointment.save();

    return res.status(200).json({
      message: "Appointment status updated successfully",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    নির্দিষ্ট appointment delete করা (DB + Cloudinary image দুটোই)
// @route   DELETE /api/appointments/:id
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      // Appointment না থাকলে error message
      return res.status(404).json({ message: "Appointment not found" });
    }

    // DB থেকে delete করার আগে Cloudinary থেকে medical report image টাও delete করা হচ্ছে
    if (appointment.medicalReportImagePublicId) {
      await cloudinary.uploader.destroy(appointment.medicalReportImagePublicId);
    }

    await Appointment.findByIdAndDelete(id);

    return res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createAppointment,
  getAppointmentsByEmail,
  updateAppointmentStatus,
  deleteAppointment,
};
