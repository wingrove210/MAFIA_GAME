from fastapi import FastAPI
from api.routes import auth, games, players
from api import websockets
# from api.websockets import websocket_router
from db import models
from db.database import async_engine
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # запуск
    async with async_engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)
    yield
    
app = FastAPI(
    title="Mafia Game API",
    description="Mafia API for backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(players.router, prefix="/api/players", tags=["players"])
app.include_router(games.router, prefix="/api/games", tags=["games"])
app.include_router(websockets.router)   
@app.get("/")
async def root():
    return {"message": "Добро пожаловать в Мафию! 🌸✨"}