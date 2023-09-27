'use client'

import withAuth from '../../components/withAuth';
import Map from '../../components/Map'

const myPage = () => {
  return (
    <Map />
  )
}

const Page = withAuth(myPage);
export default Page;