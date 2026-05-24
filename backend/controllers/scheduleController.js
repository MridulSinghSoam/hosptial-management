const Schedule = require(
  "../models/Schedule"
);


// CREATE SCHEDULE
const createSchedule =
  async (req, res) => {

    try {

      const { day, slots } =
        req.body;

      const schedule =
        await Schedule.create({

          doctor: req.user.id,

          day,

          slots,

        });

      res.status(201).json({

        message:
          "Schedule Created",

        schedule,

      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }

};



// GET DOCTOR SCHEDULE
const getDoctorSchedule =
  async (req, res) => {

    try {

      const schedules =
        await Schedule.find({

          doctor: req.params.id,

        });

      res.status(200).json(
        schedules
      );

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }

};

module.exports = {
  createSchedule,
  getDoctorSchedule,
};