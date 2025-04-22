import axios from "axios";

const API_URL = "http://localhost:8000/api"; // замени на свой адрес

export const register = async (data: {
    telegram_id: string;
  username: string;
  password: string;
}) => {
  const res = await axios.post(`${API_URL}/players/register`, data);
  return res.data;
};

export const login = async (data: {
    telegram_id: string,
  username: string;
  password: string;
}) => {
  const res = await axios.post(`${API_URL}/players/login`, data);
  return res.data;
};