const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }
}, { timestamps: true });

userSchema.methods.matchPassword = function(pw) {
  return pw === this.password;
};

module.exports = mongoose.model('User', userSchema);
