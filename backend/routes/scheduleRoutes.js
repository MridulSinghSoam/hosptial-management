const express = require("express");

const router = express.Router();

const {
  createSchedule,
  getDoctorSchedule,
} = require(
  "../controllers/scheduleController"
);

const {
  protect,
  authorizeRoles,
} = require(
  "../middleware/authMiddleware"
);


// DOCTOR CREATES
router.post(
  "/create",
  protect,
  authorizeRoles("doctor"),
  createSchedule
);


// GET SCHEDULE
router.get(
  "/:id",
  getDoctorSchedule
);

module.exports = router;