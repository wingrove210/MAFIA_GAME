import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/game-room" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/" className="[&.active]:font-bold">
          About
        </Link>
        <Link to='/vote'>
           Vote Room
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})