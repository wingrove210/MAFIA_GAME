import React, { useState } from "react";
import { register } from "../../api/userApi";
import { useNavigate } from '@tanstack/react-router';
import { AxiosError } from "axios";
const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [telegramId, setTelegramId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ username, password, telegram_id: telegramId });
      navigate({ to: "/auth" });
    } catch (err) {
    const error = err as AxiosError<{ detail: string }>;
      setError(error.response?.data?.detail || "Ошибка регистрации");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-xs mx-auto mt-10">
      <h2 className="text-xl font-bold">Регистрация</h2>
      <input
        placeholder="Никнейм"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <input
        placeholder="Telegram ID"
        value={telegramId}
        onChange={e => setTelegramId(e.target.value)}
        required
      />
      <input
        placeholder="Пароль"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="bg-blue-600 text-white py-2 rounded">Зарегистрироваться</button>
      {error && <div className="text-red-600">{error}</div>}
    </form>
  );
};

export default Register;