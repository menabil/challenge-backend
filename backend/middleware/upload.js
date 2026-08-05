const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Medical report image সরাসরি Cloudinary তে আপলোড হওয়ার জন্য storage engine
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "medical-reports", // Cloudinary তে এই folder এ সব image জমা হবে
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
    resource_type: "auto",
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});

module.exports = upload;
