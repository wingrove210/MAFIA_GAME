import { createFileRoute } from '@tanstack/react-router'
import Auth from '../pages/Auth'
export const Route = createFileRoute('/auth')({
  component: Authentification,
})

function Authentification() {
  return <Auth/>
}