const express = require("express");
const router = express.Router();
const {
  createCompany,
  getAllCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
  toggleFollow,
  getFollowedCompanies,
} = require("../controllers/companyController");
const { authenticate, authorize } = require("../middleware/auth");
const {
  validateCompany,
  validateMongoId,
  validate,
} = require("../middleware/validator");

// Public routes
router.get("/", getAllCompanies);
router.get("/:identifier", getCompany);

// Protected routes
router.use(authenticate);

// Company creation (Recruiter/Admin)
router.post(
  "/",
  authorize("recruiter", "admin"),
  validateCompany,
  validate,
  createCompany
);

// Company update (Company admin/Admin)
router.put(
  "/:id",
  authorize("recruiter", "admin"),
  validateMongoId,
  validate,
  updateCompany
);

// Company deletion (Admin only)
router.delete(
  "/:id",
  authorize("admin"),
  validateMongoId,
  validate,
  deleteCompany
);

// Follow/unfollow company (All authenticated users)
router.post("/:id/follow", validateMongoId, validate, toggleFollow);

// Get followed companies
router.get("/user/following", getFollowedCompanies);

module.exports = router;
