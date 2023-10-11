'use client'

import UsersRating from '../components/UsersRating'
import {withAuth} from '../components/withAuth';
import { Locale } from '../../../../i18n.config'

const myPage = ({
  params : { lang }
}: {
  params: { lang: Locale}
}) => {
  return (
    <UsersRating params={{lang}}/>
  )
}

const Page = withAuth(myPage);
export default Page;