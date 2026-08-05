import React, { useState } from "react";
import { checkEmail, registerUser, loginUser } from "../api.js";

// Email -> Password, দুই ধাপে auth flow। JWT/bcrypt ছাড়া সরাসরি simple check।
export default function AuthFlow({ onLoginSuccess }) {
  const [step, setStep] = useState("email"); // "email" | "password"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await checkEmail(email.trim());
      setIsNewUser(data.isNewUser);
      setInfo(data.message);
      setStep("password");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isNewUser) {
        await registerUser(email.trim(), password);
      } else {
        await loginUser(email.trim(), password);
      }
      onLoginSuccess(email.trim().toLowerCase());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Step indicator - এই flow টা প্রকৃতপক্ষেই sequential, তাই ধাপ দেখানো সার্থক */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div
            className={`h-1.5 w-10 rounded-full transition-colors ${
              step === "email" ? "bg-accent" : "bg-accent/40"
            }`}
          />
          <div
            className={`h-1.5 w-10 rounded-full transition-colors ${
              step === "password" ? "bg-accent" : "bg-surface2"
            }`}
          />
        </div>

        <div className="bg-surface border border-white/5 rounded-2xl p-8 shadow-2xl shadow-black/40">
          <h1 className="font-display text-2xl font-semibold text-white mb-1">
            MediQueue
          </h1>
          <p className="text-muted text-sm mb-6">
            Doctor appointment booking, simplified.
          </p>

          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-muted mb-1.5">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-surface2 border border-white/10 rounded-lg px-4 py-2.5 text-slate-100 placeholder:text-muted/60 outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
                />
              </div>

              {error && <p className="text-danger text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accentDim disabled:opacity-50 text-base font-semibold rounded-lg py-2.5 transition-colors"
              >
                {loading ? "Checking..." : "Continue"}
              </button>
            </form>
          )}

          {step === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="bg-surface2/60 border border-white/5 rounded-lg px-4 py-3 text-sm text-slate-300 mb-2">
                {info}
              </div>

              <div>
                <label className="block text-sm text-muted mb-1.5">
                  {isNewUser ? "Set a new password" : "Password"}
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface2 border border-white/10 rounded-lg px-4 py-2.5 text-slate-100 placeholder:text-muted/60 outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
                />
              </div>

              {error && <p className="text-danger text-sm">{error}</p>}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setPassword("");
                    setError("");
                  }}
                  className="flex-1 bg-surface2 hover:bg-white/10 text-slate-200 font-medium rounded-lg py-2.5 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-accent hover:bg-accentDim disabled:opacity-50 text-base font-semibold rounded-lg py-2.5 transition-colors"
                >
                  {loading ? "Please wait..." : isNewUser ? "Create account" : "Login"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
