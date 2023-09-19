'use client'

import CsvInput from '../../components/CsvInput'
import withAuth from '../../components/withAuth';

const myPage = () => {
  return (
    <CsvInput />
  )
}

const Page = withAuth(myPage);
export default Page;