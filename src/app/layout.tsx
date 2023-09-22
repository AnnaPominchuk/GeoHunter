import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Provider from "../components/Provider"

import { getServerSession } from "next-auth";

import Nav from "../components/Nav";
import AdminMenu from "../components/AdminMenu";

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
        <body className={inter.className}>
          <Nav />
          <AdminMenu />
            {children}
        </body>
       </Provider>
    </html>
  )
}
