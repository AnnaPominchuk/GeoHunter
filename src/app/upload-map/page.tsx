'use client'

import CsvInput from '../../components/CsvInput'
import {withAuthAdmin} from '../../components/withAuth';

const myPage = () => {
  return (
    <CsvInput />
  )
}

const Page = withAuthAdmin(myPage);
export default Page;