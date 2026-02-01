const { body, param, validationResult } = require("express-validator");

// Middleware to check validation results
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// Registration validation
exports.validateRegistration = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number"),
  body("role")
    .optional()
    .isIn(["admin", "recruiter", "seeker"])
    .withMessage("Invalid role"),
];

// Login validation
exports.validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Job creation validation
exports.validateJobCreation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Job title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Job description is required")
    .isLength({ max: 5000 })
    .withMessage("Description cannot exceed 5000 characters"),
  body("company").trim().notEmpty().withMessage("Company name is required"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("jobType")
    .optional()
    .isIn(["full-time", "part-time", "contract", "internship", "remote"])
    .withMessage("Invalid job type"),
  body("experienceLevel")
    .optional()
    .isIn(["entry", "mid", "senior", "lead"])
    .withMessage("Invalid experience level"),
  body("openings")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Openings must be at least 1"),
];

// Application validation
exports.validateApplication = [
  body("jobId")
    .notEmpty()
    .withMessage("Job ID is required")
    .isMongoId()
    .withMessage("Invalid job ID"),
  body("coverLetter")
    .optional()
    .isLength({ max: 2000 })
    .withMessage("Cover letter cannot exceed 2000 characters"),
  body("resume").optional().isURL().withMessage("Resume must be a valid URL"),
];

// Profile update validation
exports.validateProfileUpdate = [
  body("firstName").optional().trim().isLength({ max: 50 }),
  body("lastName").optional().trim().isLength({ max: 50 }),
  body("phone")
    .optional()
    .trim()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
    .withMessage("Invalid phone number format"),
  body("headline")
    .optional()
    .isLength({ max: 120 })
    .withMessage("Headline cannot exceed 120 characters"),
  body("summary")
    .optional()
    .isLength({ max: 2000 })
    .withMessage("Summary cannot exceed 2000 characters"),
];

// Experience validation
exports.validateExperience = [
  body("title").trim().notEmpty().withMessage("Job title is required"),
  body("company").trim().notEmpty().withMessage("Company name is required"),
  body("startDate").isISO8601().withMessage("Invalid start date"),
  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid end date")
    .custom((endDate, { req }) => {
      if (endDate && req.body.startDate && new Date(endDate) < new Date(req.body.startDate)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
  body("current").optional().isBoolean(),
];

// Education validation
exports.validateEducation = [
  body("school").trim().notEmpty().withMessage("School name is required"),
  body("degree").trim().notEmpty().withMessage("Degree is required"),
  body("startDate").optional().isISO8601().withMessage("Invalid start date"),
  body("endDate").optional().isISO8601().withMessage("Invalid end date"),
];

// Company validation
exports.validateCompany = [
  body("name").trim().notEmpty().withMessage("Company name is required"),
  body("description")
    .optional()
    .isLength({ max: 3000 })
    .withMessage("Description cannot exceed 3000 characters"),
  body("website").optional().isURL().withMessage("Invalid website URL"),
  body("size")
    .optional()
    .isIn(["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"])
    .withMessage("Invalid company size"),
];

// MongoDB ID validation
exports.validateMongoId = [
  param("id").isMongoId().withMessage("Invalid ID format"),
];
