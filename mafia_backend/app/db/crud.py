from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from . import models, schemas

async def create_user(db: AsyncSession, user: schemas.PlayerCreate):
    db_user = models.Player(
        telegram_id=user.telegram_id,
        username=user.username,
        password=user.password
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

async def get_player_by_telegram_id(db: AsyncSession, telegram_id: str):
    result = await db.execute(
        select(models.Player).where(models.Player.telegram_id == telegram_id)
    )
    return result.scalars().first()

async def create_game(db: AsyncSession, game: schemas.GameCreate):
    db_game = models.Game(**game.model_dump())
    db.add(db_game)
    await db.commit()
    await db.refresh(db_game)
    return db_game

async def get_games(db: AsyncSession):
    result = await db.execute(select(models.Game))
    return result.scalars().all()

async def get_game_by_id(db: AsyncSession, game_id: int):
    result = await db.execute(select(models.Game).where(models.Game.id == game_id))
    return result.scalar_one_or_none()

async def add_player_to_game(db: AsyncSession, player_game: schemas.PlayerGameCreate):
    db_pg = models.PlayerGame(**player_game.model_dump())
    db.add(db_pg)
    await db.commit()
    await db.refresh(db_pg)
    return db_pg

async def create_message(db: AsyncSession, message: schemas.MessageCreate):
    db_message = models.Messages(**message.model_dump())
    db.add(db_message)
    await db.commit()
    await db.refresh(db_message)
    return db_message

async def get_players(db: AsyncSession):
    result = await db.execute(select(models.Player))
    return result.scalars().all()


async def get_user_by_username(db: AsyncSession, username: str):
    result = await db.execute(select(models.Player).where(models.Player.username == username))
    return result.scalar_one_or_none()


async def authenticate_user(db: AsyncSession, username: str, password: str):
    user = await get_user_by_username(db, username)
    if user and user.password == password:
        return user
    return None