'use client'

import {withAuth} from './components/withAuth';
import { Locale } from '../../../i18n.config'

const myHome = ({
  params : { lang }
}: {
  params: { lang: Locale}
}) => {
  
  return (
    <div >
      
   </div>
  )
}

const Home = withAuth(myHome);
export default Home;