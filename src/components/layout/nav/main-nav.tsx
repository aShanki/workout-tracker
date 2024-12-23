import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { AuthNav } from './auth-nav';

export function MainNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center">
              <span className="text-lg font-bold">Workout Tracker</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                href="/workouts" 
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Workouts
              </Link>
              <Link 
                href="/exercises"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Exercises
              </Link>
              <Link 
                href="/progress"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Progress
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <AuthNav />
          </div>
        </div>
      </div>
    </header>
  );
}
