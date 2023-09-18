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
  Box,
  Link
} from "@mui/material";

import Image from "next/image";

import {useState} from "react";
import { signOut } from 'next-auth/react'

import { useRouter } from 'next/navigation'

import MenuIcon from '@mui/icons-material/Menu';
import ProfileIcon from '@mui/icons-material/AccountCircleOutlined';

import '../styles/global.css'

import withAuth from './withAuth';

const myNav = () => {
  const router = useRouter()

  const [ profileAnchor, setProfileAnchor ] = useState<null | HTMLElement>(null);
  const profileMenuOpen = Boolean(profileAnchor);

  const handleProfileClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setProfileAnchor(event.currentTarget);
  }

  const [ menuAnchor, setMenuAnchor ] = useState<null | HTMLElement>(null);
  const mobileMenuOpen = Boolean(menuAnchor);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
  }

  const handleMenuItemClick = (event: React.MouseEvent<HTMLLIElement>, path: string) => {
    router.push(path);
    setMenuAnchor(null);
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
                  <Link 
                      color="inherit" 
                      component="button"
                      variant="body1"
                      underline="none" 
                      sx={{ display: { xs: 'none', sm: 'block' } }}
                      onClick = {() => router.push("/map")}
                  >
                    {"Upload map"}
                  </Link>
                </Typography>
                <Typography variant="button" sx={{ mx:1 }}>
                  <Link 
                      color="inherit" 
                      component="button"
                      variant="body1"
                      underline="none" 
                      sx={{ display: { xs: 'none', sm: 'block' } }}
                      onClick = {() => router.push("/")}
                  >
                    {"Item 2"}
                  </Link>
                </Typography>
                <Typography variant="button" sx={{ ml:1, mr:5 }}>
                  <Link 
                      color="inherit" 
                      component="button"
                      variant="body1"
                      underline="none" 
                      sx={{ display: { xs: 'none', sm: 'block' } }}
                      onClick = {() => router.push("/")}
                  >
                    {"Item 3"}
                  </Link>
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

              <IconButton 
                    color="inherit" 
                    size="large" 
                    id="menu-mobile-button"
                    onClick={handleMenuClick}
                    sx={{ display: { xs: 'block', sm: 'none' } }}
              >
                  <MenuIcon />
              </IconButton>

              <Menu 
                id="mobile-menu" 
                anchorEl={menuAnchor} 
                open={mobileMenuOpen}
                onClose={() => {setMenuAnchor(null)}}
                sx={{ display: { xs: 'block', sm: 'none' } }}
              >
                <MenuItem onClick={ e => handleMenuItemClick(e, "/map") }>
                  Upload map
                </MenuItem>
                <MenuItem onClick={ e => handleMenuItemClick(e, "/") }>
                  Item 2
                </MenuItem>
                <MenuItem onClick={ e => handleMenuItemClick(e, "/") }>
                  Item 3
                </MenuItem>
              </Menu>

            </Toolbar>
          </AppBar>
  )
}

const Nav = withAuth(myNav);
export default Nav;