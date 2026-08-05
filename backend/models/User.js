const mongoose = require("mongoose");

// Note: এখানে bcrypt ব্যবহার করা হয়নি (client এর অনুরোধ অনুযায়ী), password plain text এ সেভ হচ্ছে।
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
