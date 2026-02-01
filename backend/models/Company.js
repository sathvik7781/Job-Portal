const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: 3000,
    },
    logo: {
      type: String,
    },
    website: {
      type: String,
    },
    industry: {
      type: String,
    },
    size: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
    },
    location: {
      headquarters: {
        city: String,
        state: String,
        country: String,
      },
      offices: [
        {
          city: String,
          state: String,
          country: String,
        },
      ],
    },
    founded: {
      type: Number,
    },
    specialties: [String],
    socialMedia: {
      linkedin: String,
      twitter: String,
      facebook: String,
      instagram: String,
    },
    benefits: [
      {
        type: String,
        enum: [
          "Health Insurance",
          "Dental Insurance",
          "Vision Insurance",
          "401k",
          "Flexible Hours",
          "Remote Work",
          "Paid Time Off",
          "Parental Leave",
          "Professional Development",
          "Stock Options",
          "Gym Membership",
          "Free Meals",
        ],
      },
    ],
    culture: {
      type: String,
      maxlength: 2000,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    verified: {
      type: Boolean,
      default: false,
    },
    // Analytics
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for follower count
companySchema.virtual("followerCount").get(function () {
  return this.followers.length;
});

// Virtual for active jobs
companySchema.virtual("jobs", {
  ref: "Job",
  localField: "name",
  foreignField: "company",
  count: true,
});

// Generate slug from name
companySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  next();
});

module.exports = mongoose.model("Company", companySchema);
