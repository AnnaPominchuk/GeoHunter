'use client'

import {withAuth} from '../components/withAuth';
import Map from '../components/Map'
import { Locale } from '../../../../i18n.config'

const myPage = ({
  params : { lang }
}: {
  params: { lang: Locale}
}) => {
  return (
    <Map params={{lang}}/>
  )
}

const Page = withAuth(myPage);
export default Page;