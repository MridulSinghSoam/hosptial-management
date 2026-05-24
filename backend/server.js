const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const prescriptionRoutes =require("./routes/prescriptionRoutes");
const scheduleRoutes =
  require("./routes/scheduleRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  "/api/prescriptions",
  prescriptionRoutes
);

mongoose.connect("mongodb://127.0.0.1:27017/hospitalDB")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use(
  "/api/schedules",
  scheduleRoutes
);



app.listen(5000, () => {
  console.log("Server running on port 5000");
});
