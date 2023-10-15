'use client'

import CsvInput from '@/components/CsvInput'
import { WithAuthAdmin } from '@/components/WithAuth';
import { Props } from '@/utils/Props'

const UploadMapPage = (props : Props) => {
  return (
    <CsvInput {...props}/>
  )
}

const Page = WithAuthAdmin(UploadMapPage);
export default Page;