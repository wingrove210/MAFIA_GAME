import './index.css';
import React from 'react';
import {Route, Routes} from 'react-router-dom'
import Main from './Main';
import GameId from './user/GameID';
import YourName from './user/YourName';
import YourNumber from './user/YourNumber';
import CreateGame from './admin/CreateGame';
import Login from './admin/Login';
import MafiaAmount from './admin/MafiaAmount';
import UsersAmount from './admin/UsersAmount';
import YourGameID from './admin/YourGameID';

function App() {
  return (
    <div className="h-[100vh]">
      <Routes>
       <Route path="/" element={<Main/>}/>
       <Route path="/admin" element={<Main/>}/>
       <Route path="/user" element={<YourName/>}/>
       <Route path="/game-id" element={<GameId/>}/>
       <Route path="/your-number" element={<YourNumber/>}/>
       <Route path='/create-game' element={<CreateGame/>}/>
       <Route path='/login' element={<Login/>}/>
       <Route path='/mafia-amount' element={<MafiaAmount/>}/>
       <Route path='/users-amount' element={<UsersAmount/>}/>
       <Route path='/game-id' element={<YourGameID/>}/>
       </Routes>
    </div>
  );
}

export default App;
