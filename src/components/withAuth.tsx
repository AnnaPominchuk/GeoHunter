'use client'

import Login from '@/app/login/page';

import { useSession } from 'next-auth/react';
import { redirect, usePathname } from 'next/navigation';
import Login from '@/app/login/page';

import UserRole from '../utils/UserRole'

const withAuth = <T extends Record<string, unknown>>(WrappedComponent: React.ComponentType<T>) => {
  return (props: T) => {
    const { data: session } = useSession();
    const currentPath = usePathname();

    if (!session) {
      console.log("no session ");
      if ( currentPath !== "/login" ) {
        redirect("/login"); 
      }
      return <Login />; // TO DO: return null
    }

    return <WrappedComponent {...props} />;
  };
}

const withAuthAdmin = <T extends Record<string, unknown>>(WrappedComponent: React.ComponentType<T>) => {
  return (props: T) => {
    const { data: session } = useSession();
    const currentPath = usePathname();

    if (!session) {
      console.log("no session ");
      if ( currentPath !== "/login" ) {
        redirect("/login");
      }
      return <Login />;
    }

    if ( !session?.user?.roles?.includes(UserRole.ADMIN) ) 
    {
      return <Login />;
    }

    return <WrappedComponent {...props} />;
  };
}

export {withAuth, withAuthAdmin};
