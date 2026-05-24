import axios from "axios";

const API =
  "http://localhost:5000/api/appointments";

export const bookAppointment = async (
  appointmentData
) => {

  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API}/book`,
    appointmentData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};