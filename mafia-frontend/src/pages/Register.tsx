import React, { useState } from "react";
import { register, login } from "../api/userApi";
import { useNavigate } from '@tanstack/react-router';

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | string[]>(""); 
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await register({ email, username, password });
      const data = response.data; // <-- добавлено
      localStorage.setItem("username", username);
      localStorage.setItem("user_id", String(data.user_id)); // <-- исправлено
      navigate({ to: "/profile" });
    } catch {
      setError("Ошибка регистрации");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-xs mx-auto mt-10">
      <h2 className="text-xl font-bold">Регистрация</h2>
      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
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
      <button type="submit" className="bg-blue-600 text-white py-2 rounded">Зарегистрироваться</button>
      {Array.isArray(error)
        ? error.map((msg, i) => <div key={i} className="text-red-600">{msg}</div>)
        : error && <div className="text-red-600">{error}</div>
      }
    </form>
  );
};

export default Register;