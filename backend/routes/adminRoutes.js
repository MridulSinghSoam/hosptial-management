const express = require("express");

const router = express.Router();

const {
  getAllDoctors,
  deleteDoctor,
  getDashboardStats,
} = require("../controllers/adminController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");


// GET ALL DOCTORS
router.get(
  "/doctors",
  protect,
  getAllDoctors
);


// DASHBOARD STATS
router.get(
  "/stats",
  protect,
  authorizeRoles("admin"),
  getDashboardStats
);


// DELETE DOCTOR
router.delete(
  "/doctor/:id",
  protect,
  authorizeRoles("admin"),
  deleteDoctor
);

module.exports = router;
