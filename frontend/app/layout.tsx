'use client'

import { MantineProvider } from '@mantine/core'
import { Inter } from 'next/font/google'
import '@mantine/core/styles.css'
import { AuthProvider } from './providers/auth-context'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MantineProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  )
}
