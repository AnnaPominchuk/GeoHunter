'use client'

import Link from "next/link";
import Image from "next/image";
import '../styles/global.css'

import { signIn, signOut, useSession, getProviders } from 'next-auth/react'

const Login = () => {

  return (
    <div className='flex h-screen flex-col'>
        <div className='flex w-screen p-5 gap-3 md:gap-5 items-center justify-between '>

            <Image
                src="/../../logo.png"
                width={100}
                height={100}
                alt="Logo"
            />
            <button type="button" className='bg-mainColor px-7 py-2 mt-5 mr-3 rounded-lg text-white' onClick={() => signIn('auth0')}>
                Sign In
            </button>

        </div>

        <div className='flex h-4/6 w-screen items-center justify-center flex-col'>
            <h1 className='font-bold text-5xl pb-3 text-gradient'>GeoHunter: Unveil the Hidden Truth</h1>
            <p className='text-gradient font-medium text-xl'>Join the Community of Truth-Seekers</p>
            <p className='text-gradient font-medium text-xl pb-16'>Discover, Document, & Dismantle Corruption</p>
            <p className='w-1/2 pb-5 text-center font-medium text-xl txt-whitesmoke'>
                Welcome to GeoHunter, the platform where vigilant citizens come together to shine a light on corruption. As a GeoHunter, you are equipped to unveil the obscured realities in your locality, one geolocation at a time. Uncover dubious establishments, document evidence, and help bring integrity back to your community.
            </p>
            <p className='w-1/2 text-center font-medium text-xl txt-whitesmoke'>
                 In this interactive and educational game, you’ll navigate a map bustling with information provided by a network of users, just like you. Together, we create a tapestry of truth, woven from individual threads of knowledge and awareness.
            </p>

        </div>
    </div>
  )
}

export default Login