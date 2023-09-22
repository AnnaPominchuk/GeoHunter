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
import { signOut, useSession } from 'next-auth/react'

import { useRouter } from 'next/navigation'

import UserRole from '../utils/UserRole'

import MenuIcon from '@mui/icons-material/Menu';
import ProfileIcon from '@mui/icons-material/AccountCircleOutlined';

import '../styles/global.css'

import withAuth from './withAuth';

const myNav = () => {
  const router = useRouter()
  const { data: session } = useSession()

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

              <Box >
                <Image
                  src="/../../logo-feher.png"
                  alt='logo'
                  width={170}
                  height={70}
                />
              </Box>

              { session?.user?.roles.includes(UserRole.ADMIN) && 
                <Typography variant="button" sx={{ ml: 3, mr:1 }}>
                  <Link 
                      color="inherit" 
                      component="button"
                      variant="body2"
                      underline="none" 
                      sx={{ display: { xs: 'none', sm: 'none', md:'block' } }}
                      onClick = {() => router.push("/upload-map")}
                  >
                    {"UPLOAD MAP"}
                  </Link>
                </Typography> 
              }
                <Typography variant="button" sx={{ mx:1 }}>
                  <Link 
                      color="inherit" 
                      component="button"
                      variant="body2"
                      underline="none" 
                      sx={{ display: { xs: 'none', sm: 'none', md:'block' } }}
                      onClick = {() => router.push("/map")}
                  >
                    {"VIEW MAP"}
                  </Link>
                </Typography>
                <Typography variant="button" sx={{ ml:1, mr:5, flexGrow: 1 }}>
                  <Link 
                      color="inherit" 
                      component="button"
                      variant="body2"
                      underline="none" 
                      sx={{ display: { xs: 'none', sm: 'none', md:'block' } }}
                      onClick = {() => router.push("/rating")}
                  >
                    {"ACTIVISTS RATING"}
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
                    sx={{ display: { xs: 'block', sm: 'block', md:'none' } }}
              >
                  <MenuIcon />
              </IconButton>

              <Menu 
                id="mobile-menu" 
                anchorEl={menuAnchor} 
                open={mobileMenuOpen}
                onClose={() => {setMenuAnchor(null)}}
                sx={{ display: { xs: 'block', sm: 'block', md:'none' } }}
              >
                <MenuItem onClick={ e => handleMenuItemClick(e, "/upload-map") }>
                  Upload map
                </MenuItem>
                <MenuItem onClick={ e => handleMenuItemClick(e, "/map") }>
                  View Map
                </MenuItem>
                <MenuItem onClick={ e => handleMenuItemClick(e, "/rating") }>
                  Activists rating
                </MenuItem>
              </Menu>

            </Toolbar>
          </AppBar>
  )
}

const Nav = withAuth(myNav);
export default Nav;