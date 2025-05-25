from pydantic import BaseModel
from typing import Optional

class BookingBase(BaseModel):
    seat_id: int

class BookingAction(BookingBase):
    user_id: int

class BookingOut(BookingBase):
    is_booked: bool
    user_id: Optional[int] = None

    class Config:
        orm_mode = True