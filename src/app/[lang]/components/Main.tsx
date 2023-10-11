'use client'

import customTheme from "../../../utils/Theme";

import Nav from "./Nav";
import AdminMenu from "./AdminMenu";
import { Locale } from '../../../../i18n.config'
import {withAuth} from './withAuth';

const myMain = ({
  children,
  params : { lang }
}: {
  children: React.ReactNode,
  params: { lang: Locale}
}) => {
    return (
        <>
          <Nav params={{lang}}/>
          <AdminMenu children={children} params={{lang}}/>
        </>
);
}

const Main = withAuth(myMain);
export default Main;