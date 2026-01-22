import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dao Yu 101 - Minecraft Learning Platform',
  description: 'Eine moderne Lernplattform im Minecraft-Stil',
  keywords: ['learning', 'minecraft', 'education', 'platform'],
  authors: [{ name: 'Dao Yu 101 Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#7CB342',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
