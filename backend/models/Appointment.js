const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({

  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  date: {
    type: String,
  },

  slot: {
    type: String,
  },

  status: {
    type: String,
    enum: [
      "pending",
      "approved",
      "rejected",
      "completed",
    ],
    default: "pending",
  },

});

module.exports = mongoose.model(
  "Appointment",
  appointmentSchema
);