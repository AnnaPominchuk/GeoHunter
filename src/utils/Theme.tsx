import {createTheme} from '@mui/material'
import config from '../../appconfig.json'

const theme = createTheme({
    palette: {
        primary: {
            main: config.mainColor
        },
        secondary: {
            main: "#FFFFFF"
        }
    }
});

export default theme;