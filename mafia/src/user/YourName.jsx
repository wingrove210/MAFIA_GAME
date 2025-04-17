import React from "react";
import "../index.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function YourName() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Добавьте имя в URL-параметр
    navigate(`/game-id?name=${encodeURIComponent(name)}`);
  };

  return (
    <>
      <header className="bg-black text-center text-2xl text-white py-5 absolute w-full">
        MAFIA
      </header>
      <div className="flex flex-col gap-2 justify-center items-center h-full">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ваше имя"
            required
            className="border-2 border-black rounded-xl w-[200px] px-2"
          />
          <button type='submit' className="w-[200px] border-2 border-black">Send</button>
        </form>
      </div>
    </>
  );
}

export default YourName;