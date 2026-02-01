const Job = require("../models/Job");
const Application = require("../models/Application");
const User = require("../models/User");

// @desc    Get recruiter dashboard analytics
// @route   GET /api/analytics/recruiter
// @access  Private (Recruiter/Admin)
exports.getRecruiterAnalytics = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    // Get all jobs posted by recruiter
    const jobs = await Job.find({ postedBy: recruiterId });
    const jobIds = jobs.map((job) => job._id);

    // Total jobs
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter((job) => job.status === "active").length;

    // Total applications
    const totalApplications = await Application.countDocuments({
      job: { $in: jobIds },
    });

    // Applications by status
    const applicationsByStatus = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Recent applications (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentApplications = await Application.countDocuments({
      job: { $in: jobIds },
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Top performing jobs
    const topJobs = await Job.aggregate([
      { $match: { postedBy: recruiterId } },
      {
        $project: {
          title: 1,
          company: 1,
          applicationCount: { $size: "$applications" },
        },
      },
      { $sort: { applicationCount: -1 } },
      { $limit: 5 },
    ]);

    // Applications timeline (last 7 days)
    const timeline = await Application.aggregate([
      {
        $match: {
          job: { $in: jobIds },
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          totalJobs,
          activeJobs,
          totalApplications,
          recentApplications,
        },
        applicationsByStatus: applicationsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        topJobs,
        timeline,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get job seeker dashboard analytics
// @route   GET /api/analytics/seeker
// @access  Private (Seeker)
exports.getSeekerAnalytics = async (req, res) => {
  try {
    const seekerId = req.user._id;

    // Total applications
    const totalApplications = await Application.countDocuments({
      applicant: seekerId,
    });

    // Applications by status
    const applicationsByStatus = await Application.aggregate([
      { $match: { applicant: seekerId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Recent applications (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentApplications = await Application.countDocuments({
      applicant: seekerId,
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Latest applications with job details
    const latestApplications = await Application.find({
      applicant: seekerId,
    })
      .populate("job", "title company location jobType status")
      .sort({ createdAt: -1 })
      .limit(5);

    // Application success rate
    const successfulApps = await Application.countDocuments({
      applicant: seekerId,
      status: { $in: ["shortlisted", "interview", "hired"] },
    });

    const successRate =
      totalApplications > 0
        ? ((successfulApps / totalApplications) * 100).toFixed(1)
        : 0;

    // Applications timeline (last 30 days)
    const timeline = await Application.aggregate([
      {
        $match: {
          applicant: seekerId,
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          totalApplications,
          recentApplications,
          successRate: parseFloat(successRate),
        },
        applicationsByStatus: applicationsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        latestApplications,
        timeline,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get admin dashboard analytics
// @route   GET /api/analytics/admin
// @access  Private (Admin only)
exports.getAdminAnalytics = async (req, res) => {
  try {
    // Total counts
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    // Users by role
    const usersByRole = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    // Jobs by status
    const jobsByStatus = await Job.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    const newJobs = await Job.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    const newApplications = await Application.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Growth trends
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          totalUsers,
          totalJobs,
          totalApplications,
        },
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        jobsByStatus: jobsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        recentActivity: {
          newUsers,
          newJobs,
          newApplications,
        },
        userGrowth,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get job analytics
// @route   GET /api/analytics/jobs/:id
// @access  Private (Recruiter/Admin - own jobs)
exports.getJobAnalytics = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("applications");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check authorization
    if (
      job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Application statistics
    const applicationsByStatus = await Application.aggregate([
      { $match: { job: job._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Application timeline
    const applicationTimeline = await Application.aggregate([
      { $match: { job: job._id } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        job: {
          id: job._id,
          title: job.title,
          company: job.company,
          status: job.status,
          createdAt: job.createdAt,
        },
        totalApplications: job.applications.length,
        applicationsByStatus: applicationsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        applicationTimeline,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
