'use client'

import { WithAuth } from '@/components/WithAuth'
import { Props } from '@/utils/Props'
import React from 'react'
import { Box, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import { getDictionary, Dictionary, ConvertDictionary } from '@/lib/dictionary'
import { useState, useEffect } from 'react'

const MyHome = ({ params }: Props) => {
    const [dictionary, setDictionary] = useState<Dictionary>()
    useEffect(() => {
        const setDict = async () => {
            const dict = await getDictionary(params.lang)
            setDictionary(ConvertDictionary.toDictionary(JSON.stringify(dict)))
        }

        setDict()
    }, [params.lang])

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-around',
                flexDirection: { xs: 'column', sm: 'column', md: 'row' },
                alignItems: 'center',
            }}
        >
            <Box sx={{ marginTop: '94px', marginBottom: '30px', marginLeft: '30px', alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
                <img width={300} src='../../images/logo-big.png' />
                <Typography color={grey['700']} variant='h4' sx={{marginTop:5}}>
                    Welcome to GeoHunter
                </Typography>
            </Box>
            <Box sx={{ marginTop: '94px', marginBottom: '30px', maxWidth: 1/2 }}>
                <Typography color={grey['700']} variant='h4'>
                   {dictionary ? dictionary.login.slogan : ''}
                </Typography>
                <Typography
                    color='#707070'
                    variant='h6'
                    marginTop={3}
                >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                    velit elit, rhoncus ac justo nec, tempor lacinia libero. Proin
                    ipsum sem, interdum sed sollicitudin nec, varius vel risus.
                    Vivamus tortor diam, facilisis quis nunc nec, condimentum
                    laoreet nulla. Praesent dignissim ligula vitae porttitor
                    viverra. Nam aliquam eget urna sed commodo. Morbi et vulputate
                    nulla, a consequat lorem. Etiam sed mi lectus. Nulla ullamcorper
                    maximus tristique. Donec dignissim mi enim. Nam pellentesque
                    lacinia orci sodales ultricies. Aliquam erat volutpat. Nulla
                    eget dui ac risus lobortis aliquet posuere id nulla. 
                </Typography>
            </Box>
        </Box>
    )
}

const Home = WithAuth(MyHome)
export default Home
