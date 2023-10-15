'use client'

import { WithAuth } from '@/components/WithAuth'
import { Props } from '@/utils/Props'
const Map = dynamic (() => import('@/components/Map'))
import dynamic from 'next/dynamic'

const MapPage = (props : Props) => {
  return (
    <Map {...props}/>
  )
}

const Page = WithAuth(MapPage);
export default Page;