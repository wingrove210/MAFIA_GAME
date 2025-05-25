from fastapi import FastAPI
from api.routes import auth, games, booking, players
from api import websockets
from fastapi.middleware.cors import CORSMiddleware
from db.database import AsyncSessionLocal, engine
from db.models import Base, Booking
from sqlalchemy import text

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
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(players.router, prefix="/api/players", tags=["players"])
app.include_router(games.router, prefix="/api/games", tags=["games"])
app.include_router(websockets.router)
app.include_router(booking.router, prefix="/api/booking", tags=["Booking"])

@app.get("/")
async def root():
    return {"message": "Добро пожаловать в Мафию! 🌸✨"}

@app.on_event("startup")
async def init_seats():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with AsyncSessionLocal() as session:
        # Проверяем, есть ли уже места
        result = await session.execute(text("SELECT COUNT(*) FROM bookings"))
        count = result.scalar()
        if count < 20:
            for seat_id in range(1, 21):
                seat = Booking(seat_id=seat_id)
                session.add(seat)
            await session.commit()