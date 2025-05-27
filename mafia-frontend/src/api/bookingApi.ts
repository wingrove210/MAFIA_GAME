const API_URL = 'http://127.0.0.1:8000/api/booking/toggle';

// Тип ответа от API
export interface BookingResponse {
  seat_id: number;
  is_booked: boolean;
  user_id: number;
}

// Получить список мест (оставьте как есть, если другой эндпоинт)
export async function fetchSeats(): Promise<BookingResponse[]> {
  const res = await fetch('http://127.0.0.1:8000/api/seats');
  if (!res.ok) throw new Error('Failed to fetch seats');
  return res.json();
}

// Переключить бронирование места
export async function toggleBooking(seat_id: number, user_id: number): Promise<BookingResponse> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ seat_id, user_id }),
  });
  if (!res.ok) throw new Error('Failed to toggle booking');
  return res.json();
}