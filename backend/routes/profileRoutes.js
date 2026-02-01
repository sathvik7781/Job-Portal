const express = require("express");
const router = express.Router();
const {
  getMyProfile,
  createOrUpdateProfile,
  addExperience,
  deleteExperience,
  addEducation,
  deleteEducation,
  getProfileByUserId,
  deleteProfile,
} = require("../controllers/profileController");
const { authenticate } = require("../middleware/auth");
const {
  validateProfileUpdate,
  validateExperience,
  validateEducation,
  validateMongoId,
  validate,
} = require("../middleware/validator");

// Public routes
router.get(
  "/user/:user_id",
  validateMongoId,
  validate,
  getProfileByUserId
);

// Protected routes
router.use(authenticate);

router.get("/me", getMyProfile);
router.post("/", validateProfileUpdate, validate, createOrUpdateProfile);
router.put("/", validateProfileUpdate, validate, createOrUpdateProfile);
router.delete("/", deleteProfile);

// Experience routes
router.put("/experience", validateExperience, validate, addExperience);
router.delete(
  "/experience/:exp_id",
  validateMongoId,
  validate,
  deleteExperience
);

// Education routes
router.put("/education", validateEducation, validate, addEducation);
router.delete(
  "/education/:edu_id",
  validateMongoId,
  validate,
  deleteEducation
);

module.exports = router;
