import React, { useState } from "react";
import { login } from "../api/userApi";
import { useNavigate } from '@tanstack/react-router';

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const data = await login({ username, password });
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("username", username);
      navigate({ to: "/profile" });
    } catch  {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-xs mx-auto mt-10">
      <h2 className="text-xl font-bold">Вход</h2>
      <input
        placeholder="Никнейм"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <input
        placeholder="Пароль"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="bg-blue-600 text-white py-2 rounded">Войти</button>
      {error && <div className="text-red-600">{error}</div>}
    </form>
  );
};

export default Login;