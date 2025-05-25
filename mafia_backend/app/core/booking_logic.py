from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from db.models import Booking

async def get_all_bookings(db: AsyncSession):
    result = await db.execute(select(Booking))
    return result.scalars().all()

async def toggle_booking(db: AsyncSession, seat_id: int, user_id: int):
    booking = await db.execute(select(Booking).where(Booking.seat_id == seat_id))
    booking = booking.scalar_one_or_none()
    if not booking:
        return None, "Место не найдено"

    # Если место свободно — бронируем (но не больше 3-х на пользователя)
    if not booking.is_booked:
        # Проверяем, сколько мест уже забронировано этим пользователем
        user_bookings = await db.execute(
            select(Booking).where(Booking.user_id == user_id, Booking.is_booked == True)
        )
        if len(user_bookings.scalars().all()) >= 3:
            return None, "Нельзя бронировать больше 3 мест"
        booking.is_booked = True
        booking.user_id = user_id
    # Если место уже забронировано этим пользователем — снимаем бронь
    elif booking.user_id == user_id:
        booking.is_booked = False
        booking.user_id = None
    else:
        return None, "Место уже занято другим пользователем"

    await db.commit()
    await db.refresh(booking)
    return booking, None