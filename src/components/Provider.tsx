'use client'

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from "@mui/material";

import customTheme from "../utils/Theme";

export default function Provider({children}: {children: React.ReactNode}) {
    return (
      <SessionProvider>
        <ThemeProvider theme={customTheme}>
          {children}
        </ThemeProvider>
      </SessionProvider>
);
}