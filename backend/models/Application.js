const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resume: {
      type: String, // URL to resume file
    },
    coverLetter: {
      type: String,
      maxlength: [2000, "Cover letter cannot exceed 2000 characters"],
    },
    status: {
      type: String,
      enum: [
        "applied",
        "reviewing",
        "shortlisted",
        "interview",
        "rejected",
        "hired",
      ],
      default: "applied",
    },
    notes: {
      type: String, // For recruiter notes
    },
  },
  { timestamps: true },
);

// Prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

// Index for querying
applicationSchema.index({ job: 1, status: 1 });
applicationSchema.index({ applicant: 1, status: 1 });

module.exports = mongoose.model("Application", applicationSchema);
