const Appointment = require("../models/Appointment");
const { cloudinary } = require("../config/cloudinary");
const { sendAppointmentEmail } = require("../config/mailer");

const createAppointment = async (req, res) => {
  let publicId = null;
  try {
    if (!req.file)
      return res.status(400).json({ message: "Medical report required" });
    publicId = req.file.filename;

    const { userEmail, phone, age, doctorName, appointmentDate } = req.body;

    const dup = await Appointment.findOne({
      userEmail,
      doctorName,
      appointmentDate,
    });
    if (dup) {
      await cloudinary.uploader.destroy(publicId);
      return res
        .status(400)
        .json({
          message:
            "You already have a booking with this doctor on the selected date.",
        });
    }

    const count = await Appointment.countDocuments({
      doctorName,
      appointmentDate,
    });
    const serialNumber = "Serial #" + (count + 1);

    const apt = await Appointment.create({
      userEmail,
      phone,
      age,
      doctorName,
      appointmentDate,
      medicalReportUrl: req.file.path,
      medicalReportPublicId: publicId,
      serialNumber,
    });

    await sendAppointmentEmail(
      userEmail,
      doctorName,
      appointmentDate,
      serialNumber,
    );

    res.status(201).json(apt);
  } catch (e) {
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (_) {}
    }
    res.status(500).json({ message: "Server error" });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Pending", "Approved", "Completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const apt = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!apt) return res.status(404).json({ message: "Not found" });
    res.json(apt);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const apt = await Appointment.findById(req.params.id);
    if (!apt) return res.status(404).json({ message: "Not found" });

    if (apt.medicalReportPublicId) {
      try {
        await cloudinary.uploader.destroy(apt.medicalReportPublicId);
      } catch (_) {}
    }

    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
};
