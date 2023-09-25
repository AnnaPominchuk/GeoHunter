

import customTheme from "../utils/Theme";

import Nav from "../components/Nav";
import AdminMenu from "../components/AdminMenu";

const Main = ({children}: {children: React.ReactNode}) => {
    return (
        <>
          <Nav />
          <AdminMenu children={children} />
        </>
);
}

export default Main;