'use client'

import Image from "next/image";
import '../../../styles/global.css'

import { redirect } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react'
import { getDictionary } from '@/lib/dictionary'
import { Locale } from '../../../../i18n.config'
import { useState, useEffect } from 'react'

const Login = ({
  params : { lang }
}: {
  params: { lang: Locale }
}) => {

  const [ dictionary, setDictionary ] = useState<any>()
    useEffect(() => {
      const setDict = async() => {
      const dict = await getDictionary(lang)
      setDictionary(dict)
      }   

      setDict()
  }, [])

  const { data: session } = useSession();

  if (session)
  {
    redirect(`/${lang}/`);
  }

  return (
    <div className='flex w-screen h-screen items-center justify-center flex-col bg-login'>
        <div className='z-10 ml-28 text-white'>
            <h1 className='font-bold text-4xl pb-2'> { dictionary ? dictionary.login.appName : '' }</h1>
            <h1 className='font-bold text-5xl pb-4'> { dictionary ? dictionary.login.slogan : '' } </h1>
            <p className='font-bold text-xl pb-11 max-w-2xl'>
              { dictionary ? dictionary.login.joinUs : '' }
            </p>
            <p className='w-1/2 pb-2 font-bold text-xl xs-hidden'>
              { dictionary ? dictionary.login.joinUsLong : '' }
               
            </p>
            
            <button type="button" className='bg-white px-12 py-2 mt-5 mr-3 rounded-lg text-mainColor font-bold' onClick={() => signIn('auth0')}>
              { dictionary ? dictionary.login.logIn : '' }
            </button>
        </div>

        <Image
            src='/../../parlament.png'
            fill={true}
            alt=''
            className="img-bg small-hidden"
        />

    </div>
  )
}

export default Login