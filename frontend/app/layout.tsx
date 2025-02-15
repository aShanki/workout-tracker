'use client'

import { MantineProvider } from '@mantine/core'
import { AuthProvider } from './providers/auth-context'
import '@mantine/core/styles.css'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Workout Tracker</title>
      </head>
      <body>
        <MantineProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  )
}
