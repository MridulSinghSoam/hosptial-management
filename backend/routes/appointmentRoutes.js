const express = require("express");
const router = express.Router();

const {
  bookAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  updateAppointmentStatus,
} = require("../controllers/appointmentController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");


// PATIENT BOOKS APPOINTMENT
router.post(
  "/book",
  protect,
  authorizeRoles("patient"),
  bookAppointment
);


// DOCTOR SEES APPOINTMENTS
router.get(
  "/doctor",
  protect,
  authorizeRoles("doctor"),
  getDoctorAppointments
);

router.get(
  "/patient",
  protect,
  authorizeRoles("patient"),
  getPatientAppointments
);

router.put(
  "/update/:id",
  protect,
  authorizeRoles("doctor"),
  updateAppointmentStatus
);

module.exports = router;
