import type { Metadata } from 'next'
import { Inter, Lato, Source_Code_Pro, Space_Grotesk } from 'next/font/google'
import { Providers } from '@/components/Providers'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-lato',
})

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-source-code-pro',
})

export const metadata: Metadata = {
  title: 'Viper Network - The Trustless Gateway to Web3',
  description:
    'Powered by a global fleet of nodes—delivering security, reliability, and scalability for every blockchain app.',
  icons: {
    icon: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${lato.variable} ${sourceCodePro.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
