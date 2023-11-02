'use client'

import Login from '../login/page'

import { useSession } from 'next-auth/react'
import { redirect, usePathname } from 'next/navigation'

import UserRole from '@/utils/UserRole'
import { Locale } from '@/config/i18n.config'
import { PropsWithChildren } from 'react'
import { CircularProgress, Box } from '@mui/material'
import { Props } from '@/utils/Props'

const WithAuth = <T extends Props>(
    WrappedComponent: React.ComponentType<T>
) => {
    return function WithAuth(props: T) {
        const lang: Locale = props.params.lang
        const { data: session } = useSession()
        const currentPath = usePathname()

        if (!session) {
            console.log('no session ')
            if (currentPath !== `/${lang}/login`) {
                redirect(`/${lang}/login`)
            }
            return <Login params={{ lang: lang }} />
        }

        return <WrappedComponent {...props} />
    }
}

const WithAuthComponent = <T extends PropsWithChildren<Props>>(
    WrappedComponent: React.ComponentType<T>
) => {
    return function WithAuth(props: T) {
        const lang: Locale = props.params.lang
        const { data: session, status: status } = useSession()
        const currentPath = usePathname()

        if (status === 'loading') {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        height: '100vh',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <CircularProgress />
                </Box>
            )
        }

        if (!session) {
            if (currentPath !== `/${lang}/login`) {
                redirect(`/${lang}/login`)
            }
            return <Login params={{ lang: lang }} />
        }

        return <WrappedComponent {...props} />
    }
}

const WithAuthAdmin = <T extends Props>(
    WrappedComponent: React.ComponentType<T>
) => {
    return function WithAuthAdmin(props: T) {
        const lang: Locale = props.params.lang
        const { data: session } = useSession()
        const currentPath = usePathname()

        if (!session) {
            console.log('no session ')
            if (currentPath !== `/${lang}/login`) {
                redirect(`/${lang}/login`)
            }
            return <Login params={{ lang: lang }} />
        }

        if (!session?.user?.roles?.includes(UserRole.ADMIN)) {
            return <Login params={{ lang: lang }} />
        }

        return <WrappedComponent {...props} />
    }
}

const WithAuthActivist = <T extends Props>(
    WrappedComponent: React.ComponentType<T>
) => {
    return function WithAuthActivist(props: T) {
        const lang: Locale = props.params.lang
        const { data: session } = useSession()
        const currentPath = usePathname()

        if (!session) {
            console.log('no session ')
            if (currentPath !== `/${lang}/login`) {
                redirect(`/${lang}/login`)
            }
            return <Login params={{ lang: lang }} />
        }

        if (!session?.user?.roles?.includes(UserRole.ACTIVIST)) {
            redirect(`/${lang}/`)
        }

        return <WrappedComponent {...props} />
    }
}

export { WithAuth, WithAuthAdmin, WithAuthComponent, WithAuthActivist }
