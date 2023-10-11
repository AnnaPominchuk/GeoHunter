'use client'

import { usePathname } from 'next/navigation'

import { Link, Stack } from "@mui/material";

import { i18n } from '../../../../i18n.config'

import { useRouter } from 'next/navigation'

export default function LangSwitch() {
  const pathName = usePathname()

  const redirectedPathName = (locale: string) => {
    const segments = pathName.split('/')
    segments[1] = locale
    console.log(segments.join('/'))
    return segments.join('/')
  }

  const router = useRouter()

  return (
    <Stack direction='row' spacing={2}>
      {i18n.locales.map(locale => {
        return (
          <Stack key={locale}>
            <Link
              href={redirectedPathName(locale)}
              color='#FFFFFF'
            >
              {locale}
            </Link>
          </Stack>
        )
      })}
    </Stack>
  )
}