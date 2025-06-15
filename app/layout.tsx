import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cookie Shell App',
  description: 'A deliciously interactive terminal experience'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className='font-cookie text-3xl'>{children}</body>
    </html>
  )
}
