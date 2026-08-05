const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

dotenv.config();

// Database connect করা হচ্ছে
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);

// Root route (health check)
app.get("/", (req, res) => {
  res.send("Smart Auth & Doctor Appointment System API is running...");
});

// Global error handler (multer/cloudinary error ইত্যাদি ধরার জন্য)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Something went wrong" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
