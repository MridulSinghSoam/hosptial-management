const Appointment = require("../models/Appointment");

const bookAppointment = async (req, res) => {

  try {

    const { doctorId, date, slot } = req.body;

    
    const existingAppointment =
      await Appointment.findOne({
        doctor: doctorId,
        date,
        slot,
      });

    if (existingAppointment) {
      return res.status(400).json({
        message: "Slot already booked",
      });
    }

    
    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      date,
      slot,
    });

    res.status(201).json({
      message: "Appointment Booked",
      appointment,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


const getDoctorAppointments = async (req, res) => {
  try {

    const appointments = await Appointment.find({
      doctor: req.user.id,
    })
      .populate("patient", "name email")
      .sort({ date: 1, slot: 1 });

    res.status(200).json(appointments);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getPatientAppointments = async (req, res) => {
  try {

    const appointments = await Appointment.find({
      patient: req.user.id,
    })
      .populate("doctor", "name email")
      .sort({ date: 1, slot: 1 });

    res.status(200).json(appointments);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const appointment = await Appointment.findById(
      req.params.id
    );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    appointment.status = status;

    await appointment.save();

    res.status(200).json({
      message: "Appointment Updated",
      appointment,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



module.exports = {
  bookAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  updateAppointmentStatus,
};
