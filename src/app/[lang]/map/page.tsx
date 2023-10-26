'use client'

import { WithAuth } from '@/components/WithAuth'
import { Props } from '@/utils/Props'
const MapLayout = dynamic(() => import('@/components/Map'))
import dynamic from 'next/dynamic'

const MapPage = (props: Props) => {
    return <MapLayout {...props} />
}

const Page = WithAuth(MapPage)
export default Page
