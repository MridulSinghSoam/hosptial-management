import axios from "axios";

// Base URL of backend
const API = axios.create({
  baseURL: "http://localhost:5000/api", // change if your backend runs elsewhere
});

// Attach token automatically if user is logged in
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;