import { createFileRoute } from '@tanstack/react-router'
import GameRoom from '../pages/GameRoom'
export const Route = createFileRoute('/game-room')({
  component: PlayGame,
})

function PlayGame() {
  return <GameRoom/>
}