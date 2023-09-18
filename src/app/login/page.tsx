'use client'

import Image from "next/image";
import '../../styles/global.css'

import { redirect } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react'

const Login = () => {
  const { data: session } = useSession();

  if (session)
  {
    redirect("/");
  }

  return (
    <div className='flex w-screen h-screen items-center justify-center flex-col bg-login'>
        <div className='z-10 ml-28 text-white'>
            <h1 className='font-bold text-4xl pb-2'>GeoHunter</h1>
            <h1 className='font-bold text-5xl pb-4'>Unveil the Hidden Truth</h1>
            <p className='font-bold text-xl pb-11 max-w-2xl'>
                Join the Community of Truth-Seekers Discover, Document, & Dismantle Corruption
            </p>
            <p className='w-1/2 pb-2 font-bold text-xl xs-hidden'>
               Join GeoHunter and become a beacon of truth in your community. Let’s build a world that values transparency and fairness, one discovery at a time.
            </p>
            
            <button type="button" className='bg-white px-12 py-2 mt-5 mr-3 rounded-lg text-mainColor font-bold' onClick={() => signIn('auth0')}>
                Log In
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