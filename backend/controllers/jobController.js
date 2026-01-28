const Job = require("../models/Job");
const Application = require("../models/Application");

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private (Recruiter/Admin only)
exports.createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      postedBy: req.user._id,
    };

    const job = await Job.create(jobData);

    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      data: job,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get all jobs with filters and pagination
// @route   GET /api/jobs
// @access  Public
exports.getAllJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      location,
      jobType,
      experienceLevel,
      minSalary,
      status = "active",
    } = req.query;

    // Build query
    const query = { status };

    // Search in title, description, company
    if (search) {
      query.$text = { $search: search };
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    if (minSalary) {
      query["salary.min"] = { $gte: parseInt(minSalary) };
    }

    // Execute query with pagination
    const jobs = await Job.find(query)
      .populate("postedBy", "email")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("postedBy", "email")
      .populate({
        path: "applications",
        select: "applicant status createdAt",
        populate: {
          path: "applicant",
          select: "email",
        },
      });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      data: job,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter/Admin - own jobs only)
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check ownership (unless admin)
    if (
      job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this job",
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Job updated successfully",
      data: job,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter/Admin - own jobs only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check ownership (unless admin)
    if (
      job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this job",
      });
    }

    // Delete all applications for this job
    await Application.deleteMany({ job: job._id });

    await job.deleteOne();

    res.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get jobs posted by logged-in recruiter
// @route   GET /api/jobs/my-jobs
// @access  Private (Recruiter/Admin)
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id })
      .populate("applications")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
