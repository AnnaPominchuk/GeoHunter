'use client'

import Login from '../login/page';

import { useSession } from 'next-auth/react';
import { redirect, usePathname } from 'next/navigation';

import UserRole from '../../../utils/UserRole'
import { Locale } from '../../../../i18n.config'

const withAuth = <T extends Record<string, unknown>>(WrappedComponent: React.ComponentType<T>) => {
  return (props: T) => {
    const lang:Locale = props.params.lang
    const { data: session } = useSession();
    const currentPath = usePathname();

    if (!session) {
      console.log("no session ");
      if ( currentPath !== `/${lang}/login` ) {
        redirect(`/${lang}/login`); 
      }
      return <Login params={{lang: lang}}/>; // TO DO: return null
    }

    return <WrappedComponent {...props} />;
  };
}

const withAuthAdmin = <T extends Record<string, unknown>>(WrappedComponent: React.ComponentType<T>) => {
  return (props: T) => {
    const lang:Locale = props.params.lang
    const { data: session } = useSession();
    const currentPath = usePathname();

    if (!session) {
      console.log("no session ");
      if ( currentPath !== `/${lang}/login` ) {
        redirect(`/${lang}/login`);
      }
      return <Login params={{lang: lang}}/>;
    }

    if ( !session?.user?.roles?.includes(UserRole.ADMIN) ) 
    {
      return <Login params={{lang: lang}}/>;
    }

    return <WrappedComponent {...props} />;
  };
}

export {withAuth, withAuthAdmin};
