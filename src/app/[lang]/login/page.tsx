'use client'

import Image from 'next/image'
import '@/styles/global.css'

import { redirect } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { getDictionary, Dictionary, ConvertDictionary } from '@/lib/dictionary'
import { Props } from '@/utils/Props'
import { useState, useEffect } from 'react'

const Login = ({ params }: Props) => {
    const [dictionary, setDictionary] = useState<Dictionary>()
    useEffect(() => {
        const setDict = async () => {
            const dict = await getDictionary(params.lang)
            setDictionary(ConvertDictionary.toDictionary(JSON.stringify(dict)))
        }

        setDict()
    }, [params.lang])

    const { data: session } = useSession()

    if (session) {
        redirect(`/${params.lang}/`)
    }

    return (
        <div className='flex w-screen h-screen items-center justify-center flex-col bg-login'>
            <div className='z-10 ml-28 text-white'>
                <h1 className='font-bold text-4xl pb-2'>
                    {' '}
                    {dictionary ? dictionary.login.appName : ''}
                </h1>
                <h1 className='font-bold text-5xl pb-4'>
                    {' '}
                    {dictionary ? dictionary.login.slogan : ''}{' '}
                </h1>
                <p className='font-bold text-xl pb-11 max-w-2xl'>
                    {dictionary ? dictionary.login.joinUs : ''}
                </p>
                <p className='w-1/2 pb-2 font-bold text-xl xs-hidden'>
                    {dictionary ? dictionary.login.joinUsLong : ''}
                </p>

                <button
                    type='button'
                    className='bg-white px-12 py-2 mt-5 mr-3 rounded-lg text-mainColor font-bold'
                    onClick={() => signIn('auth0')}
                >
                    {dictionary ? dictionary.login.logIn : ''}
                </button>
            </div>

            <Image
                src='/../../images/parlament.png'
                fill={true}
                alt=''
                className='img-bg small-hidden'
            />
        </div>
    )
}

export default Login
