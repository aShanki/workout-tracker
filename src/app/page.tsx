import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, LineChart, Dumbbell, Clock } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center lg:py-32 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Track Your Fitness Journey
            <br />
            Achieve Your Goals
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your personal workout companion. Plan, track, and analyze your workouts with our intuitive tracking system.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="font-semibold">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/exercises">
              <Button variant="outline" size="lg">
                Browse Exercises
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Everything you need to succeed</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Dumbbell className="h-8 w-8" />,
                title: "Exercise Library",
                description: "Access hundreds of exercises with detailed instructions"
              },
              {
                icon: <Calendar className="h-8 w-8" />,
                title: "Workout Planning",
                description: "Schedule and organize your weekly workout routines"
              },
              {
                icon: <LineChart className="h-8 w-8" />,
                title: "Progress Tracking",
                description: "Visualize your improvements over time"
              },
              {
                icon: <Clock className="h-8 w-8" />,
                title: "Time Management",
                description: "Track workout duration and rest periods"
              }
            ].map((feature, index) => (
              <div key={index} className="p-6 rounded-lg bg-background border">
                <div className="mb-4 text-primary">{feature.icon}</div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start your fitness journey?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of users who have transformed their lives with our workout tracker.
          </p>
          <Link href="/signup">
            <Button size="lg" className="font-semibold">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}