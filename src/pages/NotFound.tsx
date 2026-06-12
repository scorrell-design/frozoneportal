import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { Button } from '../components/ui'

export default function NotFound() {
  const { persona } = useAuth()
  const home = persona?.home ?? '/'
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="display text-[88px] font-bold leading-none text-ice-600/60">FOUL</p>
      <p className="eyebrow mt-1 text-frost-400">Out of play · 404</p>
      <p className="mt-4 max-w-sm text-sm text-ice-300">
        That ball hooked outside the line. The page you're looking for isn't on the field.
      </p>
      <Link to={home} className="mt-6">
        <Button>Back to {persona ? 'your dashboard' : 'home plate'}</Button>
      </Link>
    </div>
  )
}
