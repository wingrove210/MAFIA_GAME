import { createFileRoute } from '@tanstack/react-router'
import Preloader from '../components/Preloader'
export const Route = createFileRoute('/preloader')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div><Preloader/></div>
}
