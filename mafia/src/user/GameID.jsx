import React from 'react';
import '../index.css';
import { useLocation } from 'react-router-dom';

function GameId() {
  const query = new URLSearchParams(useLocation().search);
  const name = query.get('name');

  return (
    <div>
      <h1>Привет, {name}!</h1>
    </div>
  );
}

export default GameId;