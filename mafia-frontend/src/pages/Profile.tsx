import React, { useEffect, useState } from "react";
import { getProfile } from "../api/userApi";

type UserProfile = {
  id: number;
  username: string;
  email: string;
  // Добавьте другие поля, если есть
};

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string>("");
  const username = localStorage.getItem("username") || "";
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    if (username && token) {
      getProfile(username, token)
        .then(setProfile)
        .catch(() => setError("Ошибка загрузки профиля"));
    }
  }, [username, token]);

  if (error) return <div className="text-red-600">{error}</div>;
  if (!profile) return <div>Загрузка...</div>;

  return (
    <div className="max-w-xs mx-auto mt-10">
      <h2 className="text-xl font-bold mb-2">Профиль</h2>
      <div>Никнейм: {profile.username}</div>
      <div>Email: {profile.email}</div>
      {/* Добавьте другие поля по необходимости */}
    </div>
  );
};

export default Profile;