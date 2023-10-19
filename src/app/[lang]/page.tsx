'use client'

import { WithAuth } from '@/components/WithAuth'
import { Props } from '@/utils/Props'
import React from 'react'
import { Box, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'

const myHome = (props: Props) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            marginTop='64px'
            marginLeft={5}
            marginRight={5}
            marginBottom={5}
        >
            <Typography color={grey['800']} variant='h4'>
                Welcome to GeoHunter
            </Typography>
            <Typography
                component='span'
                color='#707070'
                variant='body2'
                marginTop={5}
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
                eget dui ac risus lobortis aliquet posuere id nulla. Cras
                vestibulum ipsum vitae purus accumsan, sit amet facilisis lorem
                cursus. Morbi elementum libero ut ante pharetra, id viverra urna
                luctus. Proin et ultricies felis, nec dignissim turpis. In eu
                orci eget magna condimentum fringilla id eu justo. Praesent et
                eros convallis, congue felis ut, porta ante. Duis non ante non
                massa pharetra imperdiet. Morbi eros velit, varius eget turpis
                non, fermentum ultricies magna. In vel dui sit amet erat
                consequat vestibulum. Praesent a efficitur metus. Fusce
                pellentesque eros elit, non rutrum tortor imperdiet eu.
                Suspendisse eget nibh eget sem aliquet placerat. Suspendisse
                potenti. Praesent in vulputate est. Nullam mattis mollis enim
                tincidunt pharetra. Nulla dictum turpis eget pellentesque
                malesuada. Nam rutrum quam aliquet velit tempor accumsan. Donec
                vel rhoncus nibh, ac accumsan nibh. Cras placerat suscipit nibh,
                pretium molestie neque ultrices at. Sed pulvinar vehicula sem,
                vitae mattis ante elementum a. Pellentesque vel tortor ut enim
                convallis ullamcorper. Nulla nec lectus ullamcorper, efficitur
                nisi at, eleifend nibh. Aliquam hendrerit ligula risus, id
                ultricies ante fringilla ut. Nunc placerat, nisi ac tempor
                placerat, magna sapien ultricies ante, et commodo odio libero
                scelerisque est. Sed et sem ut leo tincidunt laoreet.
            </Typography>
        </Box>
    )
}

const Home = WithAuth(myHome)
export default Home
