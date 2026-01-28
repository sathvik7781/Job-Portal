require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "Job Portal API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      jobs: "/api/jobs",
      applications: "/api/applications",
    },
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.listen(process.env.PORT, () => {
  console.log(`Express server started on port ${process.env.PORT}`);
});
