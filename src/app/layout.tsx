import type { Metadata, Viewport } from 'next'
import { VT323 } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323-google',
})

export const metadata: Metadata = {
  title: 'Stay Tuned — Retro TV Tracker',
  description: 'Stay Tuned — track your TV shows with a retro CRT aesthetic. Powered by the TVmaze API.',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#39ff14',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${vt323.variable} h-full`}>
      <body className="min-h-full bg-screen-bg text-crt-green font-vt323">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
