from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from db import schemas, crud
from api.dependencies import get_db
from db.models import User
from schemas.auth import UserOut
from sqlalchemy import select

router = APIRouter()

@router.post("/", response_model=schemas.PlayerRead)
async def create_player(player: schemas.PlayerCreate, db: AsyncSession = Depends(get_db)):
    db_player = await crud.get_player_by_telegram_id(db, telegram_id=player.telegram_id)
    if db_player:
        raise HTTPException(status_code=400, detail="Игрок уже зарегистрирован")
    return await crud.create_player(db=db, player=player)

@router.get("/{telegram_id}", response_model=schemas.PlayerRead)
async def read_player(telegram_id: str, db: AsyncSession = Depends(get_db)):
    db_player = await crud.get_player_by_telegram_id(db, telegram_id=telegram_id)
    if not db_player:
        raise HTTPException(status_code=404, detail="Игрок не найден")
    return db_player


@router.get("/players/", response_model=List[schemas.PlayerRead])
async def get_all_players(db: AsyncSession = Depends(get_db)):
    return await crud.get_players(db)

@router.post("/register", response_model=schemas.PlayerRead)
async def register(user: schemas.PlayerCreate, db: AsyncSession = Depends(get_db)):
    existing_user = await crud.get_user_by_username(db, user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Пользователь уже существует")
    return await crud.create_user(db, user)

@router.post("/login", response_model=schemas.PlayerRead)
async def login(user: schemas.PlayerCreate, db: AsyncSession = Depends(get_db)):
    authenticated_user = await crud.authenticate_user(db, user.username, user.password)
    if not authenticated_user:
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")
    return authenticated_user
