import asyncio
from services.telegram import setup_telegram_bot

if __name__ == "__main__":
    app = setup_telegram_bot()
    asyncio.run(app.run_polling())