import { createFileRoute } from '@tanstack/react-router'
import Lobby from '../pages/Lobby'
export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return  <Lobby/>
}