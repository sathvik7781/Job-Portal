const Notification = require("../models/Notification");

/**
 * Create and send a notification to a user
 * @param {Object} params - Notification parameters
 * @param {String} params.recipient - User ID of recipient
 * @param {String} params.type - Type of notification
 * @param {String} params.title - Notification title
 * @param {String} params.message - Notification message
 * @param {Object} params.data - Additional data
 * @param {String} params.actionUrl - URL for action button
 */
exports.createNotification = async ({
  recipient,
  type,
  title,
  message,
  data = {},
  actionUrl = null,
}) => {
  try {
    const notification = await Notification.create({
      recipient,
      type,
      title,
      message,
      data,
      actionUrl,
    });

    return notification;
  } catch (err) {
    console.error("Error creating notification:", err);
    return null;
  }
};

/**
 * Send notification when application is submitted
 */
exports.notifyApplicationSubmitted = async (application, job) => {
  return await this.createNotification({
    recipient: application.applicant,
    type: "application_submitted",
    title: "Application Submitted",
    message: `Your application for ${job.title} at ${job.company} has been submitted successfully`,
    data: {
      applicationId: application._id,
      jobId: job._id,
    },
    actionUrl: `/applications/${application._id}`,
  });
};

/**
 * Send notification when application status changes
 */
exports.notifyApplicationStatusChanged = async (application, job) => {
  const statusMessages = {
    reviewing: "is now being reviewed",
    shortlisted: "has been shortlisted",
    interview: "has advanced to interview stage",
    rejected: "was not selected",
    hired: "Congratulations! You've been selected",
  };

  return await this.createNotification({
    recipient: application.applicant,
    type: "application_status_changed",
    title: "Application Status Updated",
    message: `Your application for ${job.title} at ${job.company} ${statusMessages[application.status]}`,
    data: {
      applicationId: application._id,
      jobId: job._id,
      status: application.status,
    },
    actionUrl: `/applications/${application._id}`,
  });
};

/**
 * Send notification to recruiter about new application
 */
exports.notifyNewApplication = async (recruiter, application, job, applicant) => {
  return await this.createNotification({
    recipient: recruiter,
    type: "new_application_received",
    title: "New Application Received",
    message: `${applicant.email} has applied for ${job.title}`,
    data: {
      applicationId: application._id,
      jobId: job._id,
      applicantId: applicant._id,
    },
    actionUrl: `/jobs/${job._id}/applications`,
  });
};

/**
 * Send notification about job deadline approaching
 */
exports.notifyJobDeadlineApproaching = async (user, job, daysLeft) => {
  return await this.createNotification({
    recipient: user,
    type: "job_deadline_approaching",
    title: "Job Deadline Approaching",
    message: `The deadline for ${job.title} at ${job.company} is in ${daysLeft} days`,
    data: {
      jobId: job._id,
      daysLeft,
    },
    actionUrl: `/jobs/${job._id}`,
  });
};

/**
 * Send notification about new job matching user preferences
 */
exports.notifyJobMatch = async (user, job) => {
  return await this.createNotification({
    recipient: user,
    type: "new_job_match",
    title: "New Job Match",
    message: `A new job matching your preferences: ${job.title} at ${job.company}`,
    data: {
      jobId: job._id,
    },
    actionUrl: `/jobs/${job._id}`,
  });
};
