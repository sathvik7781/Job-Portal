const Profile = require("../models/Profile");
const User = require("../models/User");

// @desc    Get current user's profile
// @route   GET /api/profile/me
// @access  Private
exports.getMyProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id }).populate(
      "user",
      "email role"
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.json({
      success: true,
      data: profile,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Create or update user profile
// @route   POST/PUT /api/profile
// @access  Private
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const profileFields = {
      user: req.user._id,
      ...req.body,
    };

    let profile = await Profile.findOne({ user: req.user._id });

    if (profile) {
      // Update existing profile
      profile = await Profile.findOneAndUpdate(
        { user: req.user._id },
        { $set: profileFields },
        { new: true, runValidators: true }
      ).populate("user", "email role");

      return res.json({
        success: true,
        message: "Profile updated successfully",
        data: profile,
      });
    }

    // Create new profile
    profile = await Profile.create(profileFields);
    profile = await Profile.findById(profile._id).populate("user", "email role");

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: profile,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Add experience to profile
// @route   PUT /api/profile/experience
// @access  Private
exports.addExperience = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    profile.experience.unshift(req.body);
    await profile.save();

    res.json({
      success: true,
      message: "Experience added successfully",
      data: profile,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Delete experience from profile
// @route   DELETE /api/profile/experience/:exp_id
// @access  Private
exports.deleteExperience = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    profile.experience = profile.experience.filter(
      (exp) => exp._id.toString() !== req.params.exp_id
    );

    await profile.save();

    res.json({
      success: true,
      message: "Experience deleted successfully",
      data: profile,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Add education to profile
// @route   PUT /api/profile/education
// @access  Private
exports.addEducation = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    profile.education.unshift(req.body);
    await profile.save();

    res.json({
      success: true,
      message: "Education added successfully",
      data: profile,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Delete education from profile
// @route   DELETE /api/profile/education/:edu_id
// @access  Private
exports.deleteEducation = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    profile.education = profile.education.filter(
      (edu) => edu._id.toString() !== req.params.edu_id
    );

    await profile.save();

    res.json({
      success: true,
      message: "Education deleted successfully",
      data: profile,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get profile by user ID
// @route   GET /api/profile/:user_id
// @access  Public
exports.getProfileByUserId = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
      isPublic: true,
    }).populate("user", "email");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.json({
      success: true,
      data: profile,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Delete user profile
// @route   DELETE /api/profile
// @access  Private
exports.deleteProfile = async (req, res) => {
  try {
    await Profile.findOneAndDelete({ user: req.user._id });

    res.json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
