import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Viper Network - The Trustless Gateway to Web3',
  description: 'Powered by a global fleet of nodes—delivering security, reliability, and scalability for every blockchain app.',
  icons: {
    icon: "/icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}