const User = require("../models/User");


// GET ALL DOCTORS
const getAllDoctors = async (req, res) => {

  try {

    const doctors = await User.find({
      role: "doctor",
    }).select("-password");

    res.status(200).json(doctors);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// DELETE DOCTOR
const deleteDoctor = async (req, res) => {

  try {

    const doctor = await User.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    await doctor.deleteOne();

    res.status(200).json({
      message: "Doctor Removed",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

const Appointment = require("../models/Appointment");


// DASHBOARD STATS
const getDashboardStats = async (req, res) => {

  try {

    const totalDoctors = await User.countDocuments({
      role: "doctor",
    });

    const totalPatients = await User.countDocuments({
      role: "patient",
    });

    const totalAppointments =
      await Appointment.countDocuments();

    res.status(200).json({

      totalDoctors,
      totalPatients,
      totalAppointments,

    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

module.exports = {
  getAllDoctors,
  deleteDoctor,
  getDashboardStats,
};
