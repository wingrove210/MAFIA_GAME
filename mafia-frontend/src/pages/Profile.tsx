import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const Profile: React.FC = () => {
  const user = useSelector((state: RootState) => state.profile);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Профиль</h1>
      <div>Никнейм: {user.username}</div>
      <div>Статус: {user.is_active ? "Активен" : "Неактивен"}</div>
      <div>Дата регистрации: {new Date(user.created_at).toLocaleDateString()}</div>
      <div>Роль: {user.role}</div>
      {user.role === "admin" && (
        <button className="mt-4 px-4 py-2 bg-green-600 rounded">
          Создать игру
        </button>
      )}
    </div>
  );
};

export default Profile;