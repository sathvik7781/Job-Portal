const express = require("express");
const router = express.Router();
const {
  saveJob,
  getMySavedJobs,
  updateSavedJob,
  removeSavedJob,
  checkIfSaved,
} = require("../controllers/savedJobController");
const { authenticate, authorize } = require("../middleware/auth");
const { validateMongoId, validate } = require("../middleware/validator");
const { body } = require("express-validator");

// All routes require authentication and seeker role
router.use(authenticate);
router.use(authorize("seeker"));

router.get("/", getMySavedJobs);

router.post(
  "/",
  [
    body("jobId").isMongoId().withMessage("Invalid job ID"),
    body("notes")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Notes cannot exceed 500 characters"),
  ],
  validate,
  saveJob
);

router.get(
  "/check/:jobId",
  validateMongoId,
  validate,
  checkIfSaved
);

router.put(
  "/:id",
  validateMongoId,
  validate,
  updateSavedJob
);

router.delete(
  "/:id",
  validateMongoId,
  validate,
  removeSavedJob
);

module.exports = router;
