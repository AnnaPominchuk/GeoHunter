'use client'

import CsvInput from '@/components/CsvInput'
import { WithAuthAdmin } from '@/components/WithAuth'
import { Props } from '@/utils/Props'
import React from 'react'

const UploadMapPage = (props: Props) => {
    return <CsvInput {...props} />
}

const Page = WithAuthAdmin(UploadMapPage)
export default Page
