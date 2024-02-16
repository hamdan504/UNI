const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Create a user schema and model
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

// Pre-save hook to hash the password before saving
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(this.password, salt);
    // Replace the plaintext password with the hashed password
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const Admin = mongoose.model("admins", userSchema);

module.exports = Admin;
