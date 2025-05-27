import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import './Celendar.css'
import { fetchSeats, toggleBooking, BookingResponse } from '../api/bookingApi';

// SVG icons
const SVGIcons = () => (
  <svg display="none" viewBox="0 0 100 100">
    {/* ...вставь сюда все <symbol> из твоего SVGIcons... */}
    <symbol id="available" viewBox="0 0 100 100" >
      <g fill="currentColor">
        <circle cx="50" cy="50" r="50"></circle>
        <circle cx="50" cy="50" r="4" fill="#fff"></circle>
      </g>
    </symbol>
    <symbol id="reserved" viewBox="0 0 100 100">
      <g fill="currentColor">
        <circle cx="50" cy="50" r="50"></circle>
        <g fill="#000" opacity="0.2">
          <circle cx="50" cy="42" r="15"></circle>
          <circle cx="50" cy="110" r="40"></circle>
        </g>
      </g>
    </symbol>
    <symbol id="selected" viewBox="0 0 100 100">
      <g fill="currentColor">
        <circle cx="50" cy="50" r="50"></circle>
        <text x="50" y="65" fontSize="2.7rem" textAnchor="middle" fill="#fff">1</text>
      </g>
    </symbol>
    <symbol id="plus" viewBox="0 0 100 100">
      <g stroke="currentColor" strokeWidth="10" fill="none">
        <path d="M 20 50 h 60"></path>
        <path d="M 50 20 v 60"></path>
      </g>
    </symbol>
    <symbol id="minus" viewBox="0 0 100 100">
      <g stroke="currentColor" strokeWidth="10" fill="none">
        <path d="M 20 50 h 60"></path>
      </g>
    </symbol>
    <symbol id="close" viewBox="0 0 100 100">
      <g stroke="currentColor" strokeWidth="10" fill="none" transform="translate(50 50) rotate(45)">
        <g transform="translate(-50 -50)">
          <path d="M 10 50 h 80"></path>
          <path d="M 50 10 v 80"></path>
        </g>
      </g>
    </symbol>
  </svg>
);

const Icon = ({ href, size = 100 }: { href: string, size?: number }) => (
  <svg className={href} width={size} height={size}>
    <use href={`#${href}`} />
  </svg>
);

// --- styled-components (или @emotion/styled) ---
// ...вставь сюда все styled-компоненты из твоего примера...

// Ниже пример для одного styled-компонента, остальные вставь аналогично:
const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
  position: relative;
  &:before {
    position: absolute;
    content: "";
    bottom: calc(100% + 1rem);
    left: 50%;
    transform: translateX(-50%);
    width: 1.3rem;
    height: 0.5rem;
    border-radius: 15px;
    background: hsl(0, 0%, 90%);
  }
`;
const Main = styled.main`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  height: 100vh;
`;

const Screen = styled.div<{ theme: string }>`
  --color: ${({theme}) => theme === 'light' ? '#2c2f62' : '#eee'};
  --background: ${({theme}) => theme === 'light' ? '#fff' : '#2c2f62'};
  --accent: ${({theme}) => theme === 'light' ? '#fd6d8e' : '#fcb43c'};
  width: 100%;
  position: fixed;
  height: 100vh;
  min-height: 500px;
  color: var(--color, #2c2f62);
  background: var(--background, #ffffff);
  padding: 2rem 2rem 1.25rem;
  box-shadow: 0 2px 10px -8px hsla(0, 0%, 0%, 0.4);
`;

// --- Header ---
const HeaderTitle = styled.h1`
  font-size: 2rem;
  flex-grow: 1;
  font-weight: 900;
`;
const HeaderButton = styled.button`
  color: inherit;
  background: none;
  border: 1px solid hsl(0, 0%, 92%);
  border-radius: 50%;
  margin: 0 0.5rem;
  width: 38px;
  height: 38px;
  padding: 0.35rem;
  svg {
    width: 100%;
    height: 100%;
  }
`;
const Header = () => {
  const buttons = ['plus', 'minus'];
  return (
    <HeaderContainer>
      <HeaderTitle>Choose Seats</HeaderTitle>
      {buttons.map(button => (
        <HeaderButton key={button}>
          <Icon href={button} size={28} />
        </HeaderButton>
      ))}
    </HeaderContainer>
  );
};

// --- Legend ---
const LegendContainer = styled.div`
  display: flex;
  margin: 2rem 0;
  justify-content: center;
`;
const LegendItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0.35rem;
  svg {
    margin-right: 0.2rem;
    border-radius: 50%;
    width: 23px;
    height: 23px;
  }
`;
const LegendItemName = styled.span`
  text-transform: capitalize;
  color: hsl(0, 0%, 75%);
  letter-spacing: 0.05rem;
  font-weight: 700;
  font-size: 1rem;
`;
const Legend = () => {
  const items = ['available', 'reserved', 'selected'];
  return (
    <LegendContainer>
      {items.map(item => (
        <LegendItem key={item}>
          <Icon href={item} size={16} />
          <LegendItemName>{item}</LegendItemName>
        </LegendItem>
      ))}
    </LegendContainer>
  );
};

// --- Theater ---
const TheaterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1.75rem 0;
`;
const TheaterScreen = styled.p`
  text-align: center;
  text-transform: uppercase;
  padding: 0.3rem 1rem;
  color: hsl(0, 0%, 80%);
  border-radius: 20px;
  border: 1px solid currentColor;
  font-size: 0.5rem;
  letter-spacing: 0.1rem;
  background: inherit;
  position: relative;
  &:before, &:after {
    position: absolute;
    content: "";
    top: 50%;
    transform: translate(0%, -50%);
    width: 70px;
    height: 1px;
    background: currentColor;
  }
  &:before {
    right: 100%;
  }
  &:after {
    left: 100%;
  }
`;
const TheaterSeats = styled.div`
  margin-top: 1.5rem;
  width: 100%;
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(10, 28px);
  grid-template-rows: repeat(10, 28px);
  grid-gap: 0.75rem 0.3rem;
  grid-auto-flow: dense;
`;
const FillerSeat = styled.div`
  visibility: hidden;
  opacity: 0;
  &:nth-child(2) {
    grid-column: 10/11;
    grid-row: 1/2;
  }
  &:nth-child(3) {
    grid-row: 6/11;
    grid-column: 1/2;
  }
  &:nth-child(4) {
    grid-column: 10/11;
    grid-row: 6/11;
  }
`;
const Seat = styled.button`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: none;
  border: none;
  svg {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    pointer-events: none;
  }
`;
const Theater = ({ seats = [], toggleSeat }: { seats: string[], toggleSeat: (e: React.MouseEvent<HTMLButtonElement>) => void }) => {
  const FillerSeats = Array(4).fill('').map((_, i) => <FillerSeat key={i} />);
  const Seats = seats.map((seat, i) => (
    <Seat onClick={toggleSeat} data-index={i} data-status={seat} key={i}>
      <Icon href={seat} size={16} />
    </Seat>
  ));
  return (
    <TheaterContainer>
      <TheaterScreen>Screen</TheaterScreen>
      <TheaterSeats>
        {FillerSeats}
        {Seats}
      </TheaterSeats>
    </TheaterContainer>
  );
};

// --- Details ---
const DetailsContainer = styled.div`
  display: flex;
  align-items: center;
  // margin: 1rem 0.25rem;
  width: 100%;
  overflow: auto;
  &::-webkit-scrollbar {
    height: 0.2rem;
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px hsla(0, 0%, 0%, 0.3);
  }
  &::-webkit-scrollbar-thumb {
    background: hsl(0, 0%, 90%);
    border-radius: 5px;
  }
`;
const DetailsHeading = styled.h4`
  font-weight: 700;
  font-size: 1.5rem;
  padding: 0.5rem 0;
`;
const DetailsButton = styled.button`
  flex-shrink: 0;
  background: none;
  font-family: inherit;
  font-size: 0.7rem;
  color: hsl(0, 0%, 70%);
  border: 1px solid currentColor;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  margin: 0 0.5rem;
  display: flex;
  align-items: flex-end;
  text-transform: capitalize;
  svg {
    width: 12px;
    height: 12px;
    margin-left: 0.35rem;
    pointer-events: none;
  }
`;
const Details = ({ selectedSeats = [], removeSeat }: { selectedSeats: { seat: number, price: string }[], removeSeat: (e: React.MouseEvent<HTMLButtonElement>) => void }) => (
  <DetailsContainer>
    <DetailsHeading>Details</DetailsHeading>
    {selectedSeats.map(selectedSeat => (
      <DetailsButton onClick={removeSeat} key={selectedSeat.seat} data-index={selectedSeat.seat}>
        {Object.entries(selectedSeat).map(([property, value]) => `${property}: ${value}`).join(' ').trim()}
        <Icon href="close" size={12} />
      </DetailsButton>
    ))}
  </DetailsContainer>
);

// --- Checkout ---
const CheckoutContainer = styled.button`
  margin-top: 1.75rem;
  width: 100%;
  background: var(--accent, #fd6d8e);
  box-shadow: 0 2px 5px -4px currentColor;
  padding: 1rem 1.25rem;
  border-radius: 15px;
  font-family: inherit;
  color: var(--background, #ffffff);
  border: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const CheckoutTotal = styled.strong`
  font-size: 1.5rem;
  letter-spacing: 0.05rem;
`;
const CheckoutAction = styled.span`
  font-size: 1.3rem;
`;
const Checkout = ({ total = 0 }: { total: number }) => (
  <CheckoutContainer>
    <CheckoutTotal>{total}$</CheckoutTotal>
    <CheckoutAction>Checkout</CheckoutAction>
  </CheckoutContainer>
);

// --- Phone ---
const Phone = ({
  theme,
  seats,
  total,
  toggleSeat,
  removeSeat,
  selectedSeats,
}: {
  theme: string;
  seats: string[];
  total: number;
  toggleSeat: (e: React.MouseEvent<HTMLButtonElement>) => void;
  removeSeat: (e: React.MouseEvent<HTMLButtonElement>) => void;
  selectedSeats: { seat: number; price: string }[];
}) => (
  <Screen theme={theme}>
    <Header />
    <Legend />
    <Theater seats={seats} toggleSeat={toggleSeat} />
    <Details selectedSeats={selectedSeats} removeSeat={removeSeat} />
    <Checkout total={total} />
  </Screen>
);

// randomItem helper
const randomItem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

// Mock API functions for seat reservation/freeing
async function reserveSeat(seatIndex: number): Promise<void> {
  // Simulate API call delay
  return new Promise((resolve) => setTimeout(resolve, 200));
}

async function freeSeat(seatIndex: number): Promise<void> {
  // Simulate API call delay
  return new Promise((resolve) => setTimeout(resolve, 200));
}

// Mock fetchSeats function
// async function fetchSeats(): Promise<string[]> {
//   // Simulate fetching 20 seats with random status
//   const possibleSeats = ['available', 'reserved'];
//   return Array.from({ length: 20 }, () => randomItem(possibleSeats));
// }

// Основной компонент Celendar
export default function Celendar() {
  const [seats, setSeats] = useState<BookingResponse[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<{ seat: number, price: string }[]>([]);
  const [total, setTotal] = useState(0);
  const price = 6;
  const userId = 1; // замените на реального пользователя

  // инициализация мест
  useEffect(() => {
    fetchSeats()
      .then(setSeats)
      .catch(() => {
        // fallback на случай ошибки
        const newSeats = [];
        for (let i = 0; i < 20; i++) {
          newSeats.push({ seat_id: i, is_booked: false, user_id: 0 }); // <--- исправлено
        }
        setSeats(newSeats);
      });
  }, []);

  // обновление выбранных мест и суммы
  useEffect(() => {
    const selSeats: { seat: number, price: string }[] = [];
    let sum = 0;
    seats.forEach((seat) => {
      if (seat.is_booked && seat.user_id === userId) {
        selSeats.push({ seat: seat.seat_id, price: `$${price}` });
        sum += price;
      }
    });
    setSelectedSeats(selSeats);
    setTotal(sum);
  }, [seats, userId]);

  // обработчик выбора/отмены бронирования
  const toggleSeat = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    const seatIndex = Number(e.currentTarget.getAttribute('data-index'));
    const seat = seats[seatIndex];
    if (!seat) return;
    try {
      const updated = await toggleBooking(seat.seat_id, userId);
      setSeats(prev =>
        prev.map(s =>
          s.seat_id === updated.seat_id ? updated : s
        )
      );
    } catch (err) {
      alert('Ошибка бронирования!');
    }
  }, [seats, userId]);

  // обработчик удаления места (тоже toggle)
  const removeSeat = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    const seatId = Number(e.currentTarget.getAttribute('data-index'));
    try {
      const updated = await toggleBooking(seatId, userId);
      setSeats(prev =>
        prev.map(s =>
          s.seat_id === updated.seat_id ? updated : s
        )
      );
    } catch (err) {
      alert('Ошибка отмены!');
    }
  }, [userId]);

  // --- вставь сюда компоненты Header, Legend, Theater, Details, Checkout, Phone, Main из твоего примера ---

  // Ниже пример рендера (добавь остальные компоненты и стили):
  return (
    <Main>
      <SVGIcons />
      {/* Phone тёмная тема */}
      <Phone
        theme="dark"
        total={total}
        seats={seats.map(s => s.is_booked ? (s.user_id === userId ? 'selected' : 'reserved') : 'available')}
        toggleSeat={toggleSeat}
        removeSeat={removeSeat}
        selectedSeats={selectedSeats}
      />
    </Main>
  );
}
