import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Provider from "../components/Provider"

import { getServerSession } from "next-auth";

import Main from "../components/Main";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Activist app',
  description: 'Unveil the Hidden Truth',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <Provider session={session}>
        <body className={`${inter.className} bg-color`}>
          <Main children={children} />
        </body>
       </Provider>
    </html>
  )
}
