require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const morgan = require("morgan");

// Import routes
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const profileRoutes = require("./routes/profileRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const savedJobRoutes = require("./routes/savedJobRoutes");
const companyRoutes = require("./routes/companyRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

// Import middleware
const { apiLimiter } = require("./middleware/rateLimiter");

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Logging middleware (development only)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Connect to database
connectDB();

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Job Portal API - Enhanced Version",
    version: "2.0.0",
    endpoints: {
      auth: "/api/auth",
      jobs: "/api/jobs",
      applications: "/api/applications",
      profile: "/api/profile",
      notifications: "/api/notifications",
      savedJobs: "/api/saved-jobs",
      companies: "/api/companies",
      analytics: "/api/analytics",
    },
    features: [
      "User Authentication & Authorization",
      "Job Posting & Management",
      "Application System",
      "User Profile Management",
      "Real-time Notifications",
      "Job Bookmarking",
      "Company Profiles",
      "Analytics & Reporting",
      "Rate Limiting",
      "Input Validation",
    ],
  });
});

// Apply rate limiting to all API routes
app.use("/api", apiLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/saved-jobs", savedJobRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/analytics", analyticsRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Job Portal API Enhanced - Server Running            ║
║                                                           ║
║   Port: ${PORT}                                             ║
║   Environment: ${process.env.NODE_ENV || "development"}   ║
║   Version: 2.0.0                                          ║
║                                                           ║
║   📚 Documentation: http://localhost:${PORT}                ║
║   🏥 Health Check: http://localhost:${PORT}/health         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
