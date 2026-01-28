require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.json({ message: "dummy route" });
});

app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});
app.listen(process.env.PORT, () => {
  console.log("Express server started");
});
