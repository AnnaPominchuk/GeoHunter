'use client'

import {
  AppBar, 
  Toolbar, 
  Button, 
  ButtonGroup, 
  IconButton, 
  Menu, 
  MenuItem, 
  Typography, 
  ThemeProvider,
  Box
} from "@mui/material";

import Image from "next/image";
import customTheme from "../utils/Theme";

import Login from "../components/Login";

import {useState} from "react";
import { signIn, signOut, useSession, getProviders } from 'next-auth/react'

import MenuIcon from '@mui/icons-material/Menu';
import ProfileIcon from '@mui/icons-material/AccountCircleOutlined';

import '../styles/global.css'


export default function Nav(){

  const { data: session } = useSession();

  const [ profileAnchor, setProfileAnchor ] = useState<null | HTMLElement>(null);
  const profileMenuOpen = Boolean(profileAnchor);

  const handleProfileClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setProfileAnchor(event.currentTarget);
  }

  if (!session) 
  {
    return ( <Login /> );
  }

  return (
      <ThemeProvider theme={customTheme}>
    
       <div className='flex h-screen w-screen gap-3 md:gap-5 flex-col'>

          <AppBar 
            position="fixed"
            sx = {{zIndex: "tooltip"}}
          >
            <Toolbar>

              <Box sx={{ flexGrow: 1}} >
                <Image
                  src="/../../logo_feher.png"
                  alt='logo'
                  width={70}
                  height={70}
                />
              </Box>

                <Typography variant="h6">
                  <Button color="inherit" sx={{ mx:1 }} onClick={() => {}}>{"Item 1"}</Button>
                </Typography>
                <Typography variant="h6">
                  <Button color="inherit" sx={{ mx:1 }} onClick={() => {}}>{"Item 2"}</Button>
                </Typography>
                <Typography variant="h6" >
                  <Button color="inherit" sx={{ ml:1, mr:3 }} onClick={() => {}}>{"Item 3"}</Button>
                </Typography>

              <IconButton 
                    color="inherit" 
                    size="large" 
                    id="profile-button"
                    onClick={handleProfileClick}
              >
                  <ProfileIcon />
              </IconButton>

              <Menu 
                id="profile-menu" 
                anchorEl={profileAnchor} 
                open={profileMenuOpen}
                onClose={() => {setProfileAnchor(null)}}
              >
                <MenuItem onClick={ () => {setProfileAnchor(null)} }>
                  My Profile
                </MenuItem>
                <MenuItem onClick={() => signOut()}>
                  Log Out
                </MenuItem>
              </Menu>

            </Toolbar>
          </AppBar>

       </div>
       </ThemeProvider>
  )
}