const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, lowercase: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  doctorName: { type: String, required: true },
  appointmentDate: { type: String, required: true },
  medicalReportUrl: { type: String, required: true },
  medicalReportPublicId: { type: String, required: true },
  serialNumber: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Completed'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
