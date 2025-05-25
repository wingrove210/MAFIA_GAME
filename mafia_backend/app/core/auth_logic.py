from passlib.context import CryptContext
from sqlalchemy import select
from db.models import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def get_user_by_username(db, username: str):
    result = await db.execute(select(User).where(User.username == username))
    return result.scalar_one_or_none()

async def create_user(db, username: str, email: str, password: str):
    hashed_password = pwd_context.hash(password)
    user = User(username=username, email=email, hashed_password=hashed_password)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

async def authenticate_user(db, username: str, password: str):
    user = await get_user_by_username(db, username)
    if not user or not pwd_context.verify(password, user.hashed_password):
        return None
    return user