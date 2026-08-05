import React, { useEffect, useState, useCallback } from "react";
import { getAppointments, updateAppointmentStatus, deleteAppointment } from "../api.js";

const statusStyles = {
  Pending: "bg-warn/15 text-warn border-warn/30",
  Approved: "bg-accent/15 text-accent border-accent/30",
  Completed: "bg-slate-500/15 text-slate-300 border-slate-500/30",
};

export default function AppointmentList({ email, refreshKey }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAppointments(email);
      setAppointments(data.appointments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const handleStatusChange = async (id, status) => {
    setBusyId(id);
    try {
      await updateAppointmentStatus(id, status);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    setBusyId(id);
    try {
      await deleteAppointment(id);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="bg-surface border border-white/5 rounded-2xl p-6 shadow-xl shadow-black/30">
      <h2 className="font-display text-lg font-semibold text-white mb-4">
        Your appointments
      </h2>

      {loading && <p className="text-muted text-sm">Loading...</p>}
      {error && <p className="text-danger text-sm mb-3">{error}</p>}
      {!loading && appointments.length === 0 && (
        <p className="text-muted text-sm">No appointments booked yet.</p>
      )}

      <div className="space-y-3">
        {appointments.map((appt) => (
          <div
            key={appt._id}
            className="relative flex items-stretch bg-surface2 border border-white/5 rounded-xl overflow-hidden"
          >
            {/* Serial number stub - hospital token style, dashed tear line */}
            <div className="flex flex-col items-center justify-center px-4 py-3 border-r-2 border-dashed border-white/15 bg-black/20 min-w-[84px]">
              <span className="text-[10px] uppercase tracking-wider text-muted">
                Serial
              </span>
              <span className="font-display text-2xl font-bold text-accent leading-tight">
                #{appt.serialNumber}
              </span>
            </div>

            <div className="flex-1 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-white font-medium">{appt.doctorName}</p>
                  <p className="text-muted text-sm">
                    {new Date(appt.appointmentDate).toDateString()} · {appt.phone} · Age{" "}
                    {appt.age}
                  </p>
                  <a
                    href={appt.medicalReportImageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent text-xs underline underline-offset-2"
                  >
                    View medical report
                  </a>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyles[appt.status]}`}
                >
                  {appt.status}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <select
                  value={appt.status}
                  disabled={busyId === appt._id}
                  onChange={(e) => handleStatusChange(appt._id, e.target.value)}
                  className="bg-surface border border-white/10 rounded-lg text-sm px-2 py-1.5 text-slate-200 outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Completed">Completed</option>
                </select>

                <button
                  onClick={() => handleDelete(appt._id)}
                  disabled={busyId === appt._id}
                  className="ml-auto text-sm font-medium text-danger hover:text-red-400 disabled:opacity-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
