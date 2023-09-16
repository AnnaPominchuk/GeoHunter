'use client'

import { useSession } from 'next-auth/react'

import Login from "../components/Login";

export default function Home() {
  const { data: session } = useSession();

  if (!session)
  {
    return ( <Login /> );
  }

  return (
    <div className='flex h-screen w-screen gap-3 md:gap-5 flex-col bg-white'>
      
   </div>
  )
}
