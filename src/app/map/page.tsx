'use client'

import GoogleMap from '../../components/GoogleMap'
import withAuth from '../../components/withAuth';

const myPage = () => {
  return (
    <GoogleMap />
  )
}

const Page = withAuth(myPage);
export default Page;