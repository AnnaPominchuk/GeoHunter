import { createTheme } from '@mui/material'
import config from '../../appconfig.json'

const theme = createTheme({
    palette: {
        primary: {
            main: config.mainColor,
            light: config.additionalColor,
        },
        secondary: {
            main: '#FFFFFF',
            contrastText: config.mainColor,
        },
    },
    typography: {
        "fontFamily": "Montserrat",
   }
})

export default theme
