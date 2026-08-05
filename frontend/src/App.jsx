import React, { useState, useEffect } from "react";
import AuthFlow from "./components/AuthFlow.jsx";
import AppointmentForm from "./components/AppointmentForm.jsx";
import AppointmentList from "./components/AppointmentList.jsx";

// Note: JWT ব্যবহার হচ্ছে না, তাই login state simple ভাবে localStorage তে email রেখে track করা হচ্ছে
const STORAGE_KEY = "mediqueue_email";

export default function App() {
  const [loggedInEmail, setLoggedInEmail] = useState(
    () => localStorage.getItem(STORAGE_KEY) || null
  );
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (loggedInEmail) {
      localStorage.setItem(STORAGE_KEY, loggedInEmail);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [loggedInEmail]);

  const handleLogout = () => setLoggedInEmail(null);

  if (!loggedInEmail) {
    return <AuthFlow onLoginSuccess={setLoggedInEmail} />;
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/5 bg-surface/60 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-display text-xl font-semibold text-white">MediQueue</h1>
          <div className="flex items-center gap-4">
            <span className="text-muted text-sm hidden sm:block">{loggedInEmail}</span>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-slate-300 hover:text-white bg-surface2 hover:bg-white/10 rounded-lg px-3 py-1.5 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <AppointmentForm
          email={loggedInEmail}
          onBooked={() => setRefreshKey((k) => k + 1)}
        />
        <AppointmentList email={loggedInEmail} refreshKey={refreshKey} />
      </main>
    </div>
  );
}
