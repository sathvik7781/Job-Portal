const express = require("express");
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
} = require("../controllers/jobController");
const { authenticate, authorize } = require("../middleware/auth");
const { validateJobCreation, validate } = require("../middleware/validator");
const { jobPostLimiter } = require("../middleware/rateLimiter");

// Public routes
router.get("/", getAllJobs);
router.get("/:id", getJobById);

// Protected routes (require authentication)
router.use(authenticate);

// Recruiter/Admin only routes
// router.post("/", authorize("recruiter", "admin"), createJob);
router.post(
  "/",
  authenticate,
  authorize("recruiter", "admin"),
  jobPostLimiter,
  validateJobCreation,
  validate,
  createJob,
);
router.get("/my/jobs", authorize("recruiter", "admin"), getMyJobs);
router.put("/:id", authorize("recruiter", "admin"), updateJob);
router.delete("/:id", authorize("recruiter", "admin"), deleteJob);

module.exports = router;
