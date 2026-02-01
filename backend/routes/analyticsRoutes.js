const express = require("express");
const router = express.Router();
const {
  getRecruiterAnalytics,
  getSeekerAnalytics,
  getAdminAnalytics,
  getJobAnalytics,
} = require("../controllers/analyticsController");
const { authenticate, authorize } = require("../middleware/auth");
const { validateMongoId, validate } = require("../middleware/validator");

// All routes require authentication
router.use(authenticate);

// Role-specific analytics
router.get(
  "/recruiter",
  authorize("recruiter", "admin"),
  getRecruiterAnalytics
);

router.get("/seeker", authorize("seeker"), getSeekerAnalytics);

router.get("/admin", authorize("admin"), getAdminAnalytics);

// Job-specific analytics
router.get(
  "/jobs/:id",
  authorize("recruiter", "admin"),
  validateMongoId,
  validate,
  getJobAnalytics
);

module.exports = router;
