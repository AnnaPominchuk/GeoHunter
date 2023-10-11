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

import { useState, useEffect } from "react";
import { signOut, useSession } from 'next-auth/react'

import { useRouter } from 'next/navigation'

import MenuIcon from '@mui/icons-material/Menu';
import ProfileIcon from '@mui/icons-material/AccountCircleOutlined';
import { Locale } from '../../../../i18n.config'
import { getDictionary } from '@/lib/dictionary'
import LangSwitch from './LangSwitch'

import '../../../styles/global.css'

const Nav = ({
  params : { lang }
}: {
  params: { lang: Locale}
}) => {
  const [ dictionary, setDictionary ] = useState<any>()
  useEffect(() => {
      const setDict = async() => {
      const dict = await getDictionary(lang)
      setDictionary(dict)
      }   

      setDict()
  }, [])

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
            sx = {{zIndex: "tooltip", height:64}}
          >
            <Toolbar>

              <Box >
                <Image
                  src="/../../logo-feher.png"
                  alt='logo'
                  width={150}
                  height={70}
                />
              </Box>
  
                <Typography variant="button" sx={{ ml:5, mr:1 }}>
                  <Link 
                      color="inherit" 
                      component="button"
                      variant="body2"
                      underline="none" 
                      sx={{ display: { xs: 'none', sm: 'none', md:'block' } }}
                      onClick = {() => router.push(`/${lang}/map`)}
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
                      onClick = {() => router.push(`/${lang}/rating`)}
                  >
                    {"ACTIVISTS RATING"}
                  </Link>
                </Typography>

              <LangSwitch/>

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
                slotProps={{paper: {sx: {width: '150px'} } } }
                onClose={() => {setProfileAnchor(null)}}
              >
                <MenuItem onClick={ () => {
                  router.push(`/${lang}/my-profile`);
                  setProfileAnchor(null)
                }}>
                  { dictionary ? dictionary.navigation.profile : '' }
                </MenuItem>
                <MenuItem onClick={() => signOut()}>
                  { dictionary ? dictionary.navigation.logOut : '' }
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
                <MenuItem onClick={ e => handleMenuItemClick(e, `/${lang}/map`) }>
                  { dictionary ? dictionary.navigation.openMapButton : '' }
                </MenuItem>
                <MenuItem onClick={ e => handleMenuItemClick(e, "/rating") }>
                  { dictionary ? dictionary.navigation.openRatingButton : '' }
                </MenuItem>
              </Menu>

            </Toolbar>
          </AppBar>
  )
}

//const Nav = withAuth(myNav);
export default Nav;