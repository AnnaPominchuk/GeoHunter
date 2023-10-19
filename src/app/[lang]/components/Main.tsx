'use client'

import Nav from './Nav'
import AdminMenu from './AdminMenu'
import { WithAuthComponent } from './WithAuth'
import { PropsWithChildren } from 'react'
import { Props } from '@/utils/Props'

const myMain = (props: PropsWithChildren<Props>) => {
    return (
        <>
            <Nav {...props} />
            <AdminMenu {...props}>{props.children}</AdminMenu>
        </>
    )
}

const Main = WithAuthComponent(myMain)
export default Main
