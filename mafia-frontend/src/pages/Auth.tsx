import React, { useState } from "react";
import { login } from "../../api/userApi";
import { useNavigate } from '@tanstack/react-router';
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { setProfile } from "../redux/profileSlice";

type FastAPIValidationError = {
    loc: (string | number)[];
    msg: string;
    type: string;
    input?: unknown;
  };
const Login: React.FC = () => {
    const [telegram_id, setTelegramId] = useState("")
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login({ telegram_id, username, password });
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(setProfile(user));
      navigate({ to: "/profile" });
    } catch (err) {
      const error = err as AxiosError<{ detail: string | FastAPIValidationError[] }>;
      const detail = error.response?.data?.detail;
      if (typeof detail === "string") {
        setError(detail);
      } else if (Array.isArray(detail)) {
        setError(detail.map((d: FastAPIValidationError) => d.msg).join(", "));
      } else {
        setError("Ошибка авторизации");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-xs mx-auto mt-10">
      <h2 className="text-xl font-bold">Вход</h2>
      <input
       placeholder="Telegram Id"
       value={telegram_id}
       onChange={e => setTelegramId(e.target.value)}
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
      <button type="submit" className="bg-blue-600 text-white py-2 rounded">Войти</button>
      {error && <div className="text-red-600">{error}</div>}
      <button onClick={() => navigate({ to: "/register" })}>Register</button>
    </form>
  );
};

export default Login;