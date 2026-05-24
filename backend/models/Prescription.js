const mongoose = require("mongoose");

const prescriptionSchema =
  new mongoose.Schema({

    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    medicines: [
      {
        name: String,
        dosage: String,
      },
    ],

    notes: {
      type: String,
    },

  });

module.exports = mongoose.model(
  "Prescription",
  prescriptionSchema
);