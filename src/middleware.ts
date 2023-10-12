import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { i18n, Locale } from '../i18n.config'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    ( locale: Locale ) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = 'hu'
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    )
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `../api/`
  matcher: ['/((?!api|login|_next/static|_next/image|favicon.ico|marker.png\).*)']
}