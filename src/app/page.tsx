'use client'

import withAuth from '../components/withAuth';

const myHome = () => {
  return (
    <div className='flex h-screen w-screen gap-3 md:gap-5 flex-col bg-white'>
      
   </div>
  )
}

const Home = withAuth(myHome);
export default Home;