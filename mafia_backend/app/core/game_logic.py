import random
from typing import List
from db import models, crud, schemas
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from sqlalchemy.orm import selectinload
from api.websockets import broadcast
ROLES = ['mafia', 'doctor', 'detective', 'citizen']

async def assign_roles(db: AsyncSession, game_id: int):
    result = await db.execute(
        select(models.PlayerGame).where(models.PlayerGame.game_id == game_id)
    )
    players_in_game = result.scalars().all()
    players_count = len(players_in_game)

    if players_count < 4:
        raise ValueError("Недостаточно игроков для начала игры")

    roles_distribution = ['mafia', 'doctor', 'detective'] + \
        ['citizen'] * (players_count - 3)
    random.shuffle(roles_distribution)

    for player_game, role in zip(players_in_game, roles_distribution):
        player_game.role = role

    await db.commit()
    
async def start_game(db: AsyncSession, game_id: int):
    # Получаем игру по ID — ИМЕННО Game!
    result = await db.execute(
        select(models.Game).where(models.Game.id == game_id)
    )
    game = result.scalar_one_or_none()
    if not game:
        raise ValueError("Игра не найдена")

    if game.status != "waiting":
        raise ValueError("Игра уже началась или завершилась")

    # Назначаем роли
    await assign_roles(db, game_id)

    # Обновляем статус игры
    game.status = "active"
    game.started_at = datetime.utcnow()

    await db.commit()

async def finish_game(db: AsyncSession, game_id: int):
    result = await db.execute(
        select(models.Game).where(models.Game.id == game_id)
    )
    game = result.scalar_one_or_none()
    if not game:
        raise ValueError("Игра не найдена")

    game.status = "finished"
    game.finished_at = datetime.utcnow()

    await db.commit()
    
# app/core/game_logic.py

async def set_phase(db: AsyncSession, game_id: int, phase: str):
    result = await db.execute(select(models.Game).where(models.Game.id == game_id))
    game = result.scalar_one_or_none()
    if game:
        game.status = phase
        await db.commit()
        await notify_phase_start(game_id, phase)
        
async def get_players_with_roles(db: AsyncSession, game_id: int):
    result = await db.execute(
        select(models.PlayerGame)
        .options(selectinload(models.PlayerGame.player))
        .where(models.PlayerGame.game_id == game_id)
    )
    player_games = result.scalars().all()

    players_with_roles = [
        {
            "player_id": pg.player_id,
            "username": pg.player.username,
            "role": pg.role,
            "is_alive": pg.is_alive
        }
        for pg in player_games
    ]
    return players_with_roles

async def notify_phase_start(game_id: int, phase: str):
    await broadcast(game_id, {
        "event": "phase_start",
        "phase": phase
    })