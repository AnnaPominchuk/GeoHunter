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
  Box
} from "@mui/material";

import Image from "next/image";
import Link from "next/link";

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
    return <></>;
  }

  return (
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

                <Typography variant="button" sx={{ mx:1 }}>
                  <Link href={"/map"}>{"Upload map"}</Link>
                </Typography>
                <Typography variant="button" sx={{ mx:1 }}>
                  <Link href={"/"}>{"Item 2"}</Link>
                </Typography>
                <Typography variant="button" sx={{ ml:1, mr:5 }}>
                  <Link href={"/"}>{"Item 3"}</Link>
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
  )
}