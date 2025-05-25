import axios from "axios";

const API_URL = "http://localhost:8000/api/auth";

export const register = async (data: {
  email: string;
  username: string;
  password: string;
}) => {
  return axios.post(`${API_URL}/register`, data);
};

export const login = async (data: {
  username: string;
  password: string;
}) => {
  const response = await axios.post(`${API_URL}/login`, data);
  // Предполагается, что backend возвращает { access_token: "...", ... }
  return response.data;
};

export const getProfile = async (username: string, token: string) => {
  const response = await axios.get(`${API_URL}/profile/${username}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};