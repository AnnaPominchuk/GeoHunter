'use client'

import { usePathname } from 'next/navigation'

import { Link, Stack } from '@mui/material'

import { i18n } from '@/config/i18n.config'

import { useRouter } from 'next/navigation'
import React from 'react'

export default function LangSwitch() {
    const pathName = usePathname()
    const router = useRouter()

    return (
        <Stack direction='row' spacing={2}>
            {i18n.locales.map((locale) => {
                return (
                    <Stack key={locale}>
                        <Link
                            color='#FFFFFF'
                            underline='none'
                            component='button'
                            onClick={() => {
                                const segments = pathName.split('/')
                                segments[1] = locale
                                const path = segments.join('/')
                                router.push(path)
                            }}
                        >
                            {locale}
                        </Link>
                    </Stack>
                )
            })}
        </Stack>
    )
}
