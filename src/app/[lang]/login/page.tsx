'use client'

import Image from 'next/image'
import '@/styles/global.css'

import {
    Box,
    Button,
    Stack,
    Typography,
} from '@mui/material'

import { redirect } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { getDictionary, Dictionary, ConvertDictionary } from '@/lib/dictionary'
import { Props } from '@/utils/Props'
import { useState, useEffect } from 'react'

const Login = ({ params }: Props) => {
    const [dictionary, setDictionary] = useState<Dictionary>()
    useEffect(() => {
        const setDict = async () => {
            const dict = await getDictionary(params.lang)
            setDictionary(ConvertDictionary.toDictionary(JSON.stringify(dict)))
        }

        setDict()
    }, [params.lang])

    const { data: session } = useSession()

    if (session) {
        redirect(`/${params.lang}/`)
    }

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                flexDirection: 'column',
            }}
            className={'bg-login'}
        >
            <Stack sx={{marginLeft: "7rem", zIndex: "10", color: 'white'}}>
                <Typography fontWeight='700' fontSize='2.1rem' sx={{paddingTop: 0, paddingBottom: 0}}>
                    {dictionary ? dictionary.login.appName : ''}
                </Typography>
                <Typography fontWeight='700' fontSize='2.9rem' sx={{paddingTop: 0, paddingBottom: '0.5rem'}}>
                    {dictionary ? dictionary.login.slogan : ''}
                </Typography>

                 <Typography fontWeight='700' fontSize='1.1rem' sx={{paddingTop: 0, paddingBottom: "2rem", maxWidth: "42rem"}}>
                    {dictionary ? dictionary.login.joinUs : ''}
                </Typography>
                 <Typography fontWeight='700' fontSize='1.1rem' sx={{paddingTop: 0, paddingBottom: "0.5rem", maxWidth: 1/2}} display={{sx: "none"}}>
                    {dictionary ? dictionary.login.joinUsLong : ''}
                </Typography>

                <Button
                    variant='contained'
                    color='secondary'
                    component='label'
                    sx={{ maxWidth: "150px", background: "white", fontWeight:'900', marginTop: "1.25rem", marginRight: "0.75rem", paddingX: "3rem", paddingY: "0.5rem" }}
                    onClick={() => signIn('auth0')}
                >
                    {dictionary ? dictionary.login.logIn : ''}
                </Button>
            </Stack>

            <Image
                src='/../../images/parlament.png'
                fill={true}
                alt=''
                className='img-bg small-hidden'
            />
        </Box>
    )
}

export default Login
