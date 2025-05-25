from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship, DeclarativeBase
from datetime import datetime

class Base(DeclarativeBase):
    pass

class Player(Base):
    __tablename__ = "players"
    
    id = Column(Integer, primary_key=True, index=True)
    telegram_id = Column(String, unique=True, nullable=False)
    username = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    password = Column(String, nullable=False)
    role = Column(String, default="user")  # <--- добавь это поле
    games = relationship("PlayerGame", back_populates="player")
    
class Game(Base):
    __tablename__ = "games"
    
    id = Column(Integer, primary_key=True, index=True)
    status = Column(String, default="waiting")
    created_at = Column(DateTime, default=datetime.utcnow)
    started_at = Column(DateTime, nullable=True)
    finished_at = Column(DateTime, nullable=True)
    
    players = relationship("PlayerGame", back_populates="game")
    messages = relationship("Message", back_populates="game")
    
class PlayerGame(Base):  # Вот исправление!
    __tablename__ = "player_game"
    
    id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer, ForeignKey('players.id'))
    game_id = Column(Integer, ForeignKey('games.id'))
    role = Column(String, nullable=True)
    is_alive = Column(Boolean, default=True)
    
    player = relationship("Player", back_populates="games")
    game = relationship("Game", back_populates="players")
    
class Message(Base):  # Исправлено также здесь!
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer, ForeignKey('players.id'))
    game_id = Column(Integer, ForeignKey('games.id'))
    content = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    game = relationship("Game", back_populates='messages')

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    seat_id = Column(Integer, unique=True, nullable=False)  # 1..20
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    is_booked = Column(Boolean, default=False)

    user = relationship("User", backref="bookings")