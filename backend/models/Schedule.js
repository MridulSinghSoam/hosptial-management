const mongoose = require("mongoose");

const scheduleSchema =
  new mongoose.Schema({

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    day: {
      type: String,
    },

    slots: [
      {
        type: String,
      },
    ],

  });

module.exports =
  mongoose.model(
    "Schedule",
    scheduleSchema
  );