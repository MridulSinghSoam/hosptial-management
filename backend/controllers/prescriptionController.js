const Prescription = require(
  "../models/Prescription"
);


// CREATE PRESCRIPTION
const createPrescription =
  async (req, res) => {

    try {

      const {
        appointmentId,
        patientId,
        medicines,
        notes,
      } = req.body;

      const prescription =
        await Prescription.create({

          appointment: appointmentId,

          doctor: req.user.id,

          patient: patientId,

          medicines,

          notes,

        });

      res.status(201).json({

        message:
          "Prescription Created",

        prescription,

      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }

};


// GET PATIENT PRESCRIPTIONS
const getPatientPrescriptions =
  async (req, res) => {

    try {

      const prescriptions =
        await Prescription.find({

          patient: req.user.id,

        }).populate(
          "doctor",
          "name email"
        );

      res.status(200).json(
        prescriptions
      );

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }

};

module.exports = {
  createPrescription,
  getPatientPrescriptions,
};