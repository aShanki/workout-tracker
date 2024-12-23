import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'
import { AuthNav } from './auth-nav'

export function MainNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <div className="flex flex-1 items-center justify-between">
          <nav className="flex items-center space-x-6">
            <Link href="/" className="font-semibold">
              Workout Tracker
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/workouts" className="text-sm font-medium">
                Workouts
              </Link>
              <Link href="/exercises" className="text-sm font-medium">
                Exercises
              </Link>
            </div>
          </nav>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <AuthNav />
          </div>
        </div>
      </div>
    </header>
  )
}
