import React from "react";
import { useNavigate } from "@tanstack/react-router";

const Lobby: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Лобби</h1>
      <p>Добро пожаловать в игру Мафия!</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 rounded"
        onClick={() => navigate({ to: "/auth" })}
      >
        Перейти в игру
      </button>
    </div>
  );
};

export default Lobby;