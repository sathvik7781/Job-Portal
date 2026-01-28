const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "recruiter", "seeker"],
      default: "seeker",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
