'use client'

import { WithAuth } from '@/components/WithAuth'
import { Props } from '@/utils/Props'
import React from 'react'

const myHome = (props: Props) => {
    return <div></div>
}

const Home = WithAuth(myHome)
export default Home
