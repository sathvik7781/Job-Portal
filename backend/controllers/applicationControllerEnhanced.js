const Application = require("../models/Application");
const Job = require("../models/Job");
const {
  notifyApplicationSubmitted,
  notifyApplicationStatusChanged,
  notifyNewApplication,
} = require("../utils/notificationService");

// @desc    Apply for a job (Enhanced with notifications)
// @route   POST /api/applications
// @access  Private (Seeker only)
exports.applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter, resume } = req.body;

    // Check if job exists and is active
    const job = await Job.findById(jobId).populate("postedBy");
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

    // Send notifications
    await notifyApplicationSubmitted(application, job);
    await notifyNewApplication(job.postedBy._id, application, job, req.user);

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

// @desc    Update application status (Enhanced with notifications)
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

    const oldStatus = application.status;
    application.status = status || application.status;
    application.notes = notes || application.notes;

    await application.save();

    // Send notification if status changed
    if (status && status !== oldStatus) {
      await notifyApplicationStatusChanged(application, application.job);
    }

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

// Export other functions from original controller
const originalController = require("./applicationController");
exports.getJobApplications = originalController.getJobApplications;
exports.getMyApplications = originalController.getMyApplications;
exports.withdrawApplication = originalController.withdrawApplication;
