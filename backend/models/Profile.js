const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    // Personal Information
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    // Professional Information
    headline: {
      type: String,
      maxlength: [120, "Headline cannot exceed 120 characters"],
    },
    summary: {
      type: String,
      maxlength: [2000, "Summary cannot exceed 2000 characters"],
    },
    // Experience
    experience: [
      {
        title: {
          type: String,
          required: true,
        },
        company: {
          type: String,
          required: true,
        },
        location: String,
        startDate: {
          type: Date,
          required: true,
        },
        endDate: Date,
        current: {
          type: Boolean,
          default: false,
        },
        description: String,
      },
    ],
    // Education
    education: [
      {
        school: {
          type: String,
          required: true,
        },
        degree: {
          type: String,
          required: true,
        },
        field: String,
        startDate: Date,
        endDate: Date,
        grade: String,
        description: String,
      },
    ],
    // Skills
    skills: [
      {
        name: {
          type: String,
          required: true,
        },
        level: {
          type: String,
          enum: ["beginner", "intermediate", "advanced", "expert"],
          default: "intermediate",
        },
      },
    ],
    // Links
    portfolio: String,
    linkedin: String,
    github: String,
    website: String,
    // Resume
    resume: {
      url: String,
      filename: String,
      uploadedAt: Date,
    },
    // Preferences
    jobPreferences: {
      jobTypes: [
        {
          type: String,
          enum: ["full-time", "part-time", "contract", "internship", "remote"],
        },
      ],
      locations: [String],
      minSalary: Number,
      willingToRelocate: {
        type: Boolean,
        default: false,
      },
    },
    // Profile Completion
    profileCompletion: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    // Visibility
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Calculate profile completion percentage
profileSchema.methods.calculateCompletion = function () {
  let score = 0;
  const weights = {
    firstName: 5,
    lastName: 5,
    phone: 5,
    location: 5,
    headline: 10,
    summary: 10,
    experience: 20,
    education: 15,
    skills: 15,
    resume: 10,
  };

  if (this.firstName) score += weights.firstName;
  if (this.lastName) score += weights.lastName;
  if (this.phone) score += weights.phone;
  if (this.location?.city) score += weights.location;
  if (this.headline) score += weights.headline;
  if (this.summary) score += weights.summary;
  if (this.experience?.length > 0) score += weights.experience;
  if (this.education?.length > 0) score += weights.education;
  if (this.skills?.length >= 3) score += weights.skills;
  if (this.resume?.url) score += weights.resume;

  this.profileCompletion = score;
  return score;
};

// Virtual for full name
profileSchema.virtual("fullName").get(function () {
  return `${this.firstName || ""} ${this.lastName || ""}`.trim();
});

// Update profile completion before saving
profileSchema.pre("save", function (next) {
  this.calculateCompletion();
  next();
});

module.exports = mongoose.model("Profile", profileSchema);
