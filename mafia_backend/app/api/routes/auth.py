from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.auth import UserCreate, UserLogin, UserOut
from core.auth_logic import create_user, authenticate_user, get_user_by_username
from db.database import get_db

router = APIRouter()

@router.post("/register", response_model=UserOut)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    existing = await get_user_by_username(db, user.username)
    if existing:
        raise HTTPException(status_code=400, detail="Username already registered")
    db_user = await create_user(db, user.username, user.email, user.password)
    return db_user

@router.post("/login", response_model=UserOut)
async def login(user: UserLogin, db: AsyncSession = Depends(get_db)):
    db_user = await authenticate_user(db, user.username, user.password)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return db_user

@router.get("/profile/{username}", response_model=UserOut)
async def get_profile(username: str, db: AsyncSession = Depends(get_db)):
    user = await get_user_by_username(db, username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user