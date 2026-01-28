const Application = require("../models/Application");
const Job = require("../models/Job");

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Seeker only)
exports.applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter, resume } = req.body;

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "This job is no longer accepting applications",
      });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      coverLetter,
      resume,
    });

    // Add application to job
    await Job.findByIdAndUpdate(jobId, {
      $push: { applications: application._id },
    });

    const populatedApplication = await Application.findById(application._id)
      .populate("job", "title company")
      .populate("applicant", "email");

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: populatedApplication,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get all applications for a job (for recruiters)
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter/Admin)
exports.getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check if user owns this job (unless admin)
    if (
      job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view these applications",
      });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate("applicant", "email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get all applications by logged-in user (for job seekers)
// @route   GET /api/applications/my
// @access  Private (Seeker)
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate("job", "title company location jobType status")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Update application status (for recruiters)
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter/Admin)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const application = await Application.findById(req.params.id).populate(
      "job"
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Check if user owns the job (unless admin)
    if (
      application.job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this application",
      });
    }

    application.status = status || application.status;
    application.notes = notes || application.notes;

    await application.save();

    const updatedApplication = await Application.findById(application._id)
      .populate("job", "title company")
      .populate("applicant", "email");

    res.json({
      success: true,
      message: "Application status updated successfully",
      data: updatedApplication,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Withdraw application
// @route   DELETE /api/applications/:id
// @access  Private (Seeker - own applications only)
exports.withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Check ownership
    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to withdraw this application",
      });
    }

    // Remove from job's applications array
    await Job.findByIdAndUpdate(application.job, {
      $pull: { applications: application._id },
    });

    await application.deleteOne();

    res.json({
      success: true,
      message: "Application withdrawn successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
