const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// সব response এর জন্য একটা common helper - error হলে message সহ throw করবে
async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

// ---------- Auth ----------

export const checkEmail = (email) =>
  fetch(`${API_URL}/auth/check-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  }).then(handleResponse);

export const registerUser = (email, password) =>
  fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(handleResponse);

export const loginUser = (email, password) =>
  fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(handleResponse);

// ---------- Appointments ----------

export const createAppointment = (formData) =>
  fetch(`${API_URL}/appointments`, {
    method: "POST",
    body: formData, // FormData - Content-Type browser নিজে সেট করে দেবে
  }).then(handleResponse);

export const getAppointments = (email) =>
  fetch(`${API_URL}/appointments/${encodeURIComponent(email)}`).then(handleResponse);

export const updateAppointmentStatus = (id, status) =>
  fetch(`${API_URL}/appointments/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  }).then(handleResponse);

export const deleteAppointment = (id) =>
  fetch(`${API_URL}/appointments/${id}`, { method: "DELETE" }).then(handleResponse);
