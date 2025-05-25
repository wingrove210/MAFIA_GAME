from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from db.database import get_db
from db.models import Booking
from schemas.booking import BookingAction, BookingOut
from sqlalchemy import select
from core.booking_logic import toggle_booking

router = APIRouter()

@router.get("/seats", response_model=list[BookingOut])
async def get_seats(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Booking))
    bookings = result.scalars().all()
    return bookings

@router.post("/toggle", response_model=BookingOut)
async def toggle_seat(action: BookingAction, db: AsyncSession = Depends(get_db)):
    booking, error = await toggle_booking(db, action.seat_id, action.user_id)
    if error:
        raise HTTPException(status_code=400, detail=error)
    return booking