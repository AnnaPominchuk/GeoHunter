import Link from "next/link";
import Image from "next/image";
import '../styles/global.css'

import { useState, useEffect } from "react";
//import { signIn, signOut, useSession, getProviders } from "next-auth/react";

import { getServerSession } from "next-auth";

const Nav = async () => {

  const session = await getServerSession();

  return (
    /* Desktop Navigation */
    <div className=''>
      { !session?.user?.name ? (
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

          <button type="button" className='bg-violet-800 px-7 py-2 rounded-lg text-white'>
            Sign In
          </button>

        </div>
      )
      : (
       <div>
        <p>{'You are logged in'}</p>
       </div>
      )}
    </div>
  )
}

export default Nav