'use client'

import customTheme from "../utils/Theme";

import Nav from "../components/Nav";
import AdminMenu from "../components/AdminMenu";

import withAuth from './withAuth';

const myMain = ({children}: {children: React.ReactNode}) => {
    return (
        <>
          <Nav />
          <AdminMenu children={children} />
        </>
);
}

const Main = withAuth(myMain);
export default Main;