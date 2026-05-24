import API from "./axios";

// LOGIN
export const loginUser = (formData) => {
  return API.post("/auth/login", formData);
};

// REGISTER
export const registerUser = (formData) => {
  return API.post("/auth/register", formData);
};

// GET CURRENT USER (optional but useful later)
export const getMe = () => {
  return API.get("/auth/me");
};