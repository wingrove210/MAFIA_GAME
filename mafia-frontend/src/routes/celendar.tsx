import { createFileRoute } from '@tanstack/react-router'
import Celendar from '../pages/Celendar'
export const Route = createFileRoute('/celendar')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div><Celendar/></div>
}
