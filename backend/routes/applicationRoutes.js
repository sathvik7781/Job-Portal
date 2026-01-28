const express = require("express");
const router = express.Router();
const {
  applyForJob,
  getJobApplications,
  getMyApplications,
  updateApplicationStatus,
  withdrawApplication,
} = require("../controllers/applicationController");
const { authenticate, authorize } = require("../middleware/auth");

// All routes require authentication
router.use(authenticate);

// Job seeker routes
router.post("/", authorize("seeker"), applyForJob);
router.get("/my", authorize("seeker"), getMyApplications);
router.delete("/:id", authorize("seeker"), withdrawApplication);

// Recruiter/Admin routes
router.get("/job/:jobId", authorize("recruiter", "admin"), getJobApplications);
router.put("/:id/status", authorize("recruiter", "admin"), updateApplicationStatus);

module.exports = router;
