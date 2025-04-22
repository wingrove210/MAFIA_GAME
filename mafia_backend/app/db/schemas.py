from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class PlayerBase(BaseModel):
    telegram_id: str
    username: str
    password: str
    role: str = "user"
    
class PlayerCreate(PlayerBase):
    pass

class PlayerRead(PlayerBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
        
class GameBase(BaseModel):
    status: str = "waiting"
    
class GameCreate(GameBase):
    pass

class GameRead(GameBase):
    id: int
    created_at: datetime
    started_at: Optional[datetime]
    finished_at: Optional[datetime]
    
    class Config:
        from_attributes = True
        
class PlayerGameBase(BaseModel):
    player_id: int
    game_id: int
    role: Optional[str] = "string"
    is_alive: bool = True
    
class PlayerGameCreate(PlayerGameBase):
    pass

class PlayerGameRead(PlayerGameBase):
    id: int
    
    class Config:
        from_attributes=True
        
class MessageBase(BaseModel):
    game_id: int
    player_id: Optional[int] = None
    content: str
    
class MessageCreate(MessageBase):
    pass

class MessageRead(MessageBase):
    id: int
    timestamp: datetime
    
    class Config:
        from_attributes=True