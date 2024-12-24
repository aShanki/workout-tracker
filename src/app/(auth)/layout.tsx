import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/70 to-zinc-900/90 z-10" />
        <Image
          src="/images/gym-background.jpg"
          alt="Gym background"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 flex items-center gap-2">
          <div className="rounded-full bg-white/90 p-1 backdrop-blur-sm dark:bg-zinc-800/90 w-10 h-10 flex items-center justify-center">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={32}
              height={32}
              className="w-8 h-8"
              style={{ transform: 'scale(1.4)' }}
            />
          </div>
          <Link 
            href="/" 
            className="text-lg font-bold tracking-tight hover:text-zinc-200 transition-colors"
            aria-label="Return to home page"
          >
            Workout Tracker
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium leading-tight">
              "The only bad workout is the one that didn't happen. Start your fitness journey today and track your progress with precision."
            </p>
            <footer className="text-sm text-zinc-300">
              Transform your body, track your success
            </footer>
          </blockquote>
        </div>
      </div>
      <div className="relative lg:p-8">
        <div className="absolute inset-0 bg-gradient-to-t from-muted to-muted/50 blur-[200px]" />
        <div className="relative mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="mb-4 rounded-full bg-zinc-100 p-1.5 dark:bg-zinc-800 w-12 h-12 flex items-center justify-center">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={40}
                height={40}
                className="w-10 h-10"
                style={{ transform: 'scale(1.4)' }}
              />
            </div>
            {children}
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="hover:text-primary underline underline-offset-4"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="hover:text-primary underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
