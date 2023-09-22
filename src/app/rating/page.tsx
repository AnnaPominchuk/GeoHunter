'use client'

import UsersRating from '../../components/UsersRating'
import withAuth from '../../components/withAuth';

const myPage = () => {
  return (
    <UsersRating />
  )
}

const Page = withAuth(myPage);
export default Page;