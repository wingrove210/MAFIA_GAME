import asyncio
from db.database import AsyncSessionLocal, engine
from db.models import Base, Booking

async def main():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with AsyncSessionLocal() as session:
        for seat_id in range(1, 21):
            seat = Booking(seat_id=seat_id)
            session.add(seat)
        await session.commit()

if __name__ == "__main__":
    asyncio.run(main())