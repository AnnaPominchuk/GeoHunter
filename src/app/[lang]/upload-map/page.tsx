'use client'

import CsvInput from '../components/CsvInput'
import {withAuthAdmin} from '../components/withAuth';
import { Locale } from '../../../../i18n.config'

const myPage = ({
  params : { lang }
}: {
  params: { lang: Locale }
}) => {
  return (
    <CsvInput params={{lang}}/>
  )
}

const Page = withAuthAdmin(myPage);
export default Page;