const SavedJob = require("../models/SavedJob");
const Job = require("../models/Job");

// @desc    Save a job
// @route   POST /api/saved-jobs
// @access  Private (Seeker)
exports.saveJob = async (req, res) => {
  try {
    const { jobId, notes } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check if already saved
    const existingSave = await SavedJob.findOne({
      user: req.user._id,
      job: jobId,
    });

    if (existingSave) {
      return res.status(400).json({
        success: false,
        message: "Job already saved",
      });
    }

    const savedJob = await SavedJob.create({
      user: req.user._id,
      job: jobId,
      notes,
    });

    const populatedSave = await SavedJob.findById(savedJob._id).populate(
      "job",
      "title company location jobType salary"
    );

    res.status(201).json({
      success: true,
      message: "Job saved successfully",
      data: populatedSave,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get all saved jobs for logged-in user
// @route   GET /api/saved-jobs
// @access  Private (Seeker)
exports.getMySavedJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const savedJobs = await SavedJob.find({ user: req.user._id })
      .populate("job")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await SavedJob.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      count: savedJobs.length,
      data: savedJobs,
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

// @desc    Update saved job notes
// @route   PUT /api/saved-jobs/:id
// @access  Private (Seeker)
exports.updateSavedJob = async (req, res) => {
  try {
    const { notes } = req.body;

    let savedJob = await SavedJob.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!savedJob) {
      return res.status(404).json({
        success: false,
        message: "Saved job not found",
      });
    }

    savedJob.notes = notes;
    await savedJob.save();

    savedJob = await SavedJob.findById(savedJob._id).populate(
      "job",
      "title company location"
    );

    res.json({
      success: true,
      message: "Notes updated successfully",
      data: savedJob,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Remove saved job
// @route   DELETE /api/saved-jobs/:id
// @access  Private (Seeker)
exports.removeSavedJob = async (req, res) => {
  try {
    const savedJob = await SavedJob.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!savedJob) {
      return res.status(404).json({
        success: false,
        message: "Saved job not found",
      });
    }

    res.json({
      success: true,
      message: "Job removed from saved list",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Check if a job is saved
// @route   GET /api/saved-jobs/check/:jobId
// @access  Private (Seeker)
exports.checkIfSaved = async (req, res) => {
  try {
    const savedJob = await SavedJob.findOne({
      user: req.user._id,
      job: req.params.jobId,
    });

    res.json({
      success: true,
      isSaved: !!savedJob,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
