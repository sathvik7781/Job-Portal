const Company = require("../models/Company");

// @desc    Create a company profile
// @route   POST /api/companies
// @access  Private (Recruiter/Admin)
exports.createCompany = async (req, res) => {
  try {
    const companyData = {
      ...req.body,
      createdBy: req.user._id,
      admins: [req.user._id],
    };

    const company = await Company.create(companyData);

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: company,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
exports.getAllCompanies = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      industry,
      size,
      verified,
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (industry) {
      query.industry = industry;
    }

    if (size) {
      query.size = size;
    }

    if (verified !== undefined) {
      query.verified = verified === "true";
    }

    const companies = await Company.find(query)
      .populate("createdBy", "email")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Company.countDocuments(query);

    res.json({
      success: true,
      data: companies,
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

// @desc    Get single company by ID or slug
// @route   GET /api/companies/:identifier
// @access  Public
exports.getCompany = async (req, res) => {
  try {
    const { identifier } = req.params;

    // Try to find by ID first, then by slug
    let company = await Company.findById(identifier).populate(
      "createdBy",
      "email"
    );

    if (!company) {
      company = await Company.findOne({ slug: identifier }).populate(
        "createdBy",
        "email"
      );
    }

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // Get active jobs for this company
    const Job = require("../models/Job");
    const jobs = await Job.find({
      company: company.name,
      status: "active",
    }).limit(10);

    res.json({
      success: true,
      data: {
        ...company.toObject(),
        activeJobs: jobs,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Private (Company admin)
exports.updateCompany = async (req, res) => {
  try {
    let company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // Check if user is admin of this company
    const isAdmin =
      company.admins.includes(req.user._id) || req.user.role === "admin";

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this company",
      });
    }

    company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Company updated successfully",
      data: company,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Private (Admin only)
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    await company.deleteOne();

    res.json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Follow/Unfollow company
// @route   POST /api/companies/:id/follow
// @access  Private
exports.toggleFollow = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const isFollowing = company.followers.includes(req.user._id);

    if (isFollowing) {
      // Unfollow
      company.followers = company.followers.filter(
        (follower) => follower.toString() !== req.user._id.toString()
      );
      await company.save();

      return res.json({
        success: true,
        message: "Company unfollowed successfully",
        isFollowing: false,
      });
    } else {
      // Follow
      company.followers.push(req.user._id);
      await company.save();

      return res.json({
        success: true,
        message: "Company followed successfully",
        isFollowing: true,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get companies followed by user
// @route   GET /api/companies/following
// @access  Private
exports.getFollowedCompanies = async (req, res) => {
  try {
    const companies = await Company.find({
      followers: req.user._id,
    }).sort({ name: 1 });

    res.json({
      success: true,
      count: companies.length,
      data: companies,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
