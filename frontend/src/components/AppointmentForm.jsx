import React, { useState } from "react";
import { createAppointment } from "../api.js";

// নতুন appointment বুকিং করার ফর্ম
export default function AppointmentForm({ email, onBooked }) {
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetForm = () => {
    setPhone("");
    setAge("");
    setDoctorName("");
    setAppointmentDate("");
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!file) {
      setError("Please attach the medical report image.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("age", age);
      formData.append("doctorName", doctorName);
      formData.append("appointmentDate", appointmentDate);
      formData.append("medicalReportImage", file);

      const data = await createAppointment(formData);
      setSuccess(
        `Booked! Dr. ${data.appointment.doctorName} — Serial #${data.appointment.serialNumber}`
      );
      resetForm();
      onBooked();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface border border-white/5 rounded-2xl p-6 shadow-xl shadow-black/30">
      <h2 className="font-display text-lg font-semibold text-white mb-4">
        Book an appointment
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted mb-1.5">Phone</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full bg-surface2 border border-white/10 rounded-lg px-3 py-2.5 text-slate-100 placeholder:text-muted/60 outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1.5">Age</label>
            <input
              type="number"
              min="0"
              required
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="28"
              className="w-full bg-surface2 border border-white/10 rounded-lg px-3 py-2.5 text-slate-100 placeholder:text-muted/60 outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1.5">Doctor name</label>
          <input
            type="text"
            required
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            placeholder="Dr. Rahim Uddin"
            className="w-full bg-surface2 border border-white/10 rounded-lg px-3 py-2.5 text-slate-100 placeholder:text-muted/60 outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1.5">Appointment date</label>
          <input
            type="date"
            required
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            className="w-full bg-surface2 border border-white/10 rounded-lg px-3 py-2.5 text-slate-100 outline-none focus:ring-2 focus:ring-accent focus:border-accent transition [color-scheme:dark]"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1.5">Medical report (image/PDF)</label>
          <input
            type="file"
            required
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent/15 file:text-accent file:font-medium hover:file:bg-accent/25 file:cursor-pointer cursor-pointer"
          />
        </div>

        {error && <p className="text-danger text-sm">{error}</p>}
        {success && <p className="text-accent text-sm">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent hover:bg-accentDim disabled:opacity-50 text-base font-semibold rounded-lg py-2.5 transition-colors"
        >
          {loading ? "Booking..." : "Confirm booking"}
        </button>
      </form>
    </div>
  );
}
