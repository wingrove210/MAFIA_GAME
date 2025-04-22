import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://mafia_user:mafia_pass@localhost:5432/mafia_db"
    )
    SECRET_KEY: str = os.getenv("SECRET_KEY", "твоя-супер-секретная-фраза")
    TELEGRAM_BOT_TOKEN: str = os.getenv("TELEGRAM_BOT_TOKEN", "токен-телеграм-бота")
    class Config:
        env_file = ".env"
        
settings = Settings()