import axios from "axios";

const API =
  "http://localhost:5000/api/auth";


// LOGIN
export const loginUser =
  async (userData) => {

    const response =
      await axios.post(
        `${API}/login`,
        userData
      );

    return response.data;

};


// REGISTER
export const registerUser =
  async (userData) => {

    const response =
      await axios.post(
        `${API}/register`,
        userData
      );

    return response.data;

};