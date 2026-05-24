const express = require("express");

const router = express.Router();

const {
  createPrescription,
  getPatientPrescriptions,
} = require(
  "../controllers/prescriptionController"
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
  createPrescription
);


// PATIENT VIEWS
router.get(
  "/my",
  protect,
  authorizeRoles("patient"),
  getPatientPrescriptions
);

module.exports = router;