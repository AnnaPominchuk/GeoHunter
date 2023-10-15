import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Provider from "@/components/Provider"
import { i18n } from '@/config/i18n.config'
import { Props } from '@/utils/Props'
import { PropsWithChildren } from 'react'


import Main from "@/components/Main"

const inter = Inter({ subsets: ['latin'] })

export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ lang: locale }))
}

export const metadata: Metadata = {
  title: 'Activist app',
  description: 'Unveil the Hidden Truth',
}

export default async function RootLayout({params, children} :  PropsWithChildren<Props>) {

  return (
    <html lang={params.lang}>
      <Provider>
        <body className={`${inter.className} bg-color`}>
          <Main params={params}>{children}</Main>
        </body>
       </Provider>
    </html>
  )
}
