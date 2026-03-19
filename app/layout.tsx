import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Blockhead Comics - Keep Smiling!',
  description: 'Follow the adventures of Blockhead and friends in this daily comic strip full of sunshine, chaos, and coffee.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
