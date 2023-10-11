import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Provider from "./components/Provider"
import { Locale, i18n } from '../../../i18n.config'

import { getServerSession } from "next-auth";

import Main from "./components/Main";

const inter = Inter({ subsets: ['latin'] })

export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ lang: locale }))
}

export const metadata: Metadata = {
  title: 'Activist app',
  description: 'Unveil the Hidden Truth',
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode,
  params: { lang: Locale }
}) {
  const session = await getServerSession();

  return (
    <html lang={params.lang}>
      <Provider session={session}>
        <body className={`${inter.className} bg-color`}>
          <Main params={{lang: params.lang}} children={children} />
        </body>
       </Provider>
    </html>
  )
}
