'use client'

import { useSession } from 'next-auth/react';
import { redirect, usePathname } from 'next/navigation';

const withAuth = <T extends Record<string, unknown>>(WrappedComponent: React.ComponentType<T>) => {
  return (props: T) => {
    const { data: session } = useSession();
    const currentPath = usePathname();

    if (!session) {
      console.log("no session ");
      if ( currentPath !== "/login" ) {
        redirect("/login");
      }
      
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

export default withAuth;
