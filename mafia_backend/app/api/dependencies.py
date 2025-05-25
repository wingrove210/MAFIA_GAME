from typing import AsyncGenerator
from db.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with get_db() as session:
        yield session