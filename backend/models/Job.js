const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    salary: {
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        default: "USD",
      },
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "remote"],
      default: "full-time",
    },
    experienceLevel: {
      type: String,
      enum: ["entry", "mid", "senior", "lead"],
      default: "entry",
    },
    skills: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    openings: {
      type: Number,
      default: 1,
      min: [1, "Must have at least 1 opening"],
    },
    deadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "closed", "draft"],
      default: "active",
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Index for better search performance
jobSchema.index({ title: "text", description: "text", company: "text" });
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ postedBy: 1 });

// Virtual for application count
jobSchema.virtual("applicationCount").get(function () {
  return this.applications.length;
});

module.exports = mongoose.model("Job", jobSchema);
