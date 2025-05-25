import { createFileRoute } from '@tanstack/react-router'
import Profile from '../pages/Profile'
import ProtectedRoute from '../components/ProtectedRoute'
export const Route = createFileRoute('/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return 
  <ProtectedRoute>
        <Profile/>
  </ProtectedRoute>
}
