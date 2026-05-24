import { useState } from "react";
import { bookAppointment } from "../api/appointmentApi";

const BookAppointment = () => {

  const [doctorId, setDoctorId] =
    useState("");

  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const data =
        await bookAppointment({
          doctorId,
          date,
        });

      console.log(data);

      alert("Appointment Booked 🔥");

    } catch (error) {

      console.log(error);

      alert("Error ❌");
    }
  };

  return (
    <div>

      <h1>Book Appointment</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Doctor ID"
          onChange={(e) =>
            setDoctorId(e.target.value)
          }
        />

        <br /><br />

        <input
          type="date"
          onChange={(e) =>
            setDate(e.target.value)
          }
        />

        <br /><br />

        <button type="submit">
          Book
        </button>

      </form>

    </div>
  );
};

export default BookAppointment;