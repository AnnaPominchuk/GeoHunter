'use client'

import Link from "next/link";
import Image from "next/image";
import '../styles/global.css'

import { signIn, signOut, useSession, getProviders } from 'next-auth/react'

export default function Nav(){

  const { data: session } = useSession();

  return (
    /* Desktop Navigation */
    <div className=''>
      { !session ? (
        <div className='flex h-screen w-screen gap-3 md:gap-5 items-center justify-center flex-col'>

          <input className='purple_shadow rounded-lg p-3 w-1/5'
            placeholder="Enter your email"
            type={"text"}
            id="name"
            name="name"
          />

          <input className='purple_shadow rounded-lg p-3 w-1/5'
            placeholder="Enter password"
            type={"text"}
            id="name"
            name="name"
          />

          <button type="button" className='bg-violet-800 px-7 py-2 rounded-lg text-white' onClick={() => signIn('auth0')}>
            Sign In
          </button>

        </div>
      )
      : (
       <div className='flex h-screen w-screen gap-3 md:gap-5 items-center justify-center flex-col'>
        <button type="button" className='bg-violet-800 px-7 py-2 rounded-lg text-white' onClick={() => signOut()}>
            Log Out
          </button>
       </div>
      )}
    </div>
  )
}