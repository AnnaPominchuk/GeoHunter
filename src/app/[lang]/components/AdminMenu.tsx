'use client'

import React from 'react';

import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { getDictionary } from '@/lib/dictionary'
import { Locale } from '../../../../i18n.config'

import {
  IconButton, Box,
} from "@mui/material";

import { styled, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RateReviewIcon from '@mui/icons-material/RateReview';

import UserRole from '../../../utils/UserRole'

import { makeStyles } from "@mui/styles";
import { useTheme } from "@emotion/react";
import clsx from "clsx";

const drawerWidth = 240;
const headerHeight = 64

const useStyles = makeStyles((theme: Theme) => {
  return ({
  content: {
    transition: (theme) => theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: 500
    }),
    marginLeft:  `calc(${theme.spacing(7)} + 1px)` ,
  },
  contentOpenDrawer: {
    transition: (theme) => theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: 500
    }),
    marginLeft:   drawerWidth,
  }
})});

const openedMixin = (customTheme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: customTheme.transitions.create('width', {
    easing: customTheme.transitions.easing.sharp,
    duration: customTheme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  marginTop: headerHeight,
});

const closedMixin = (customTheme: Theme): CSSObject => ({
  transition: customTheme.transitions.create('width', {
    easing: customTheme.transitions.easing.sharp,
    duration: customTheme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${customTheme.spacing(7)} + 1px)`,
  [customTheme.breakpoints.up('sm')]: {
    width: `calc(${customTheme.spacing(8)} + 1px)`,
  },
  marginTop: headerHeight, // necessary for content to be below app bar
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const AdminMenu = ({
  children,
  params : { lang }
}: {
  children: React.ReactNode,
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

  const [ isDrawerOpen, setDrawerOpen ] = useState(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const customTheme = useTheme();
  const classes = useStyles(customTheme);

  const menuItems: { 
    text: string; 
    onClickHandler: React.MouseEventHandler<HTMLDivElement>;
    renderIcon: React.ReactNode
  }[] = dictionary ? [
    {
          text: dictionary.adminMenu.mapUploadButton,
          onClickHandler: () => router.push(`/${lang}/upload-map`),
          renderIcon : <CloudUploadIcon />
    },
    {
          text: dictionary.adminMenu.reviewsButton,
          onClickHandler: () => router.push(`/${lang}/reviews`),
          renderIcon : <RateReviewIcon />
    },
  ] : []

  if ( !session?.user?.roles?.includes(UserRole.ADMIN) ) 
    return ( <main> <Box sx={{marginTop:`${headerHeight}px`}}> {children} </Box> </main> );

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Drawer variant="permanent" open={isDrawerOpen}>
          <DrawerHeader>
            <IconButton onClick={ isDrawerOpen? handleDrawerClose : handleDrawerOpen}>
             {isDrawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
         </DrawerHeader>
         <Divider />
         <List>
           {menuItems.map((item, index) => (
              <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: isDrawerOpen ? 'initial' : 'center',
                    px: 2.5,
                  }}
                  onClick={item.onClickHandler}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isDrawerOpen ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.renderIcon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} sx={{ opacity: isDrawerOpen ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
       </Box>

       <main className= {clsx(classes.content, {[classes.contentOpenDrawer]: isDrawerOpen})} >
        { children }
       </main>
    </>
  )
}

//const AdminMenu = withAuthAdmin(myAdminMenu);
export default AdminMenu;