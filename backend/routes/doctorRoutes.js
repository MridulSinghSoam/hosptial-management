const express = require("express");

const router = express.Router();

const { getAllDoctors } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getAllDoctors);

module.exports = router;
