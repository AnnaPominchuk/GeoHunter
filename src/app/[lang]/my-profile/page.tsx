'use client'

import {
    Box,
    Button,
    ButtonGroup,
    Typography,
    TextField,
    InputAdornment,
} from '@mui/material'

import { styled } from '@mui/material/styles'
import { grey } from '@mui/material/colors'

import { WithAuth } from '@/components/withAuth'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

import Reviews from '@/components/Reviews'
import ProfilePhoto from '@/components/ProfilePhoto'

import UserRole from '@/utils/UserRole'
import {User, Convert} from '@/model/User'

import ModeEditIcon from '@mui/icons-material/ModeEdit'

import VisuallyHiddenInput from '@/utils/VisuallyHiddenInput'
import { getDictionary, Dictionary, ConvertDictionary } from '@/lib/dictionary'
import { Props } from '@/utils/Props'

const StyledButtonGroup = styled(ButtonGroup)({
    '& .MuiButtonGroup-grouped:not(:last-of-type)': {
        borderColor: 'white',
    },
})

const Profile = ({ params }: Props) => {
    const [dictionary, setDictionary] = useState<Dictionary>()
    useEffect(() => {
        const setDict = async () => {
            const dict = await getDictionary(params.lang)
            setDictionary(ConvertDictionary.toDictionary(JSON.stringify(dict)))
        }

        setDict()
    }, [params.lang])

    const { data: session } = useSession()

    const [user, setUser] = useState<User | null>(null)
    const [updProfilePhotoKey, setProfilePhotoKey] = useState<{
        key: string
    } | null>(null)

    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [textInput, setTextInput] = useState('')

    useEffect(() => {
        setProfilePhotoKey({ key: user?.profilePhotoKey ?? '' })
    }, [user])

    const handleProfilePhotoChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        await fetch(`../api/user/${session?.user?.email}`, {
            method: 'GET',
        })
            .then((res) => res.json())
            .then((users) => {
                if (users.status != 200) return Promise.reject('No users found')

                if (!event.target.files) return Promise.reject('No users found')

                const formData = new FormData()
                formData.append('images', event.target.files[0])
                formData.append('userId', users.data.users._id)

                return fetch('../api/profile-photo', {
                    method: 'POST',
                    body: formData,
                })
            })
            .then(() =>
                fetch(`../api/profile-photo/user/${user?._id}`, {
                    method: 'GET',
                })
            )
            .then((res) => res.json())
            .then((data) => {
                if (data.status == 200)
                    setProfilePhotoKey({ key: data.data.key })
            })
            .catch((error) => console.error(error))
    }

    useEffect(() => {
        async function getUser() {
            try {
                const resUser = await fetch(
                    `../api/user/${session?.user?.email}`,
                    {
                        method: 'GET',
                    }
                )

                const users = await resUser.json()

                const user:User = Convert.toUser(
                    JSON.stringify(users.data.users)
                )

                console.log({user: user})

                if (users.status == 200) setUser(user)
            } catch (e) {
                console.error('Handle error', e)
            }
        }

        getUser()
    }, [session?.user?.email])

    const handleTextInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setTextInput(event.target.value)
    }

    const handleNameChange = async () => {
        await fetch(`../api/user/${session?.user?.email}`, {
            method: 'PATCH',
            body: JSON.stringify({ name: textInput }),
        })
            .then((res) => res.json())
            .then((users) => {
                if (users.status != 200) return Promise.reject('No users found')

                return fetch(`../api/user/${session?.user?.email}`, {
                    method: 'GET',
                })
            })
            .then((res) => res.json())
            .then((user) => {
                if (user.status != 200) return Promise.reject('No users found')

                setUser(user.data.users)
            })
            .finally(() => {
                setIsEditing(false)
            })
            .catch((error) => console.log(error))
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: { xs: 'center', sm: 'center', md: 'space-around' },
                alignItems: { xs: 'center', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'column', md: 'row' },
                marginBottom: '30px'
            }}
            bgcolor='secondary.main'
        >
            {/* Left */}
            <Box sx={{ margin: '50px' }} bgcolor='secondary.main'>
                <div
                    style={{
                        borderRadius: '50%',
                        overflow: 'hidden',
                        width: '200px',
                        height: '200px',
                    }}
                >
                    <ProfilePhoto params={{ user, updProfilePhotoKey, width: 200 }} />
                </div>

                <StyledButtonGroup sx={{ marginTop: '10px' }} variant='text'>
                    <Button component='label'>
                        {dictionary
                            ? dictionary.profile.uploadPhotobButton
                            : ''}
                        <VisuallyHiddenInput
                            type='file'
                            accept='image/png, image/gif, image/jpeg'
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                handleProfilePhotoChange(event)
                            }}
                        ></VisuallyHiddenInput>
                    </Button>
                </StyledButtonGroup>

                {isEditing ? (
                    <Typography variant='subtitle2' sx={{ marginTop: '8px' }}>
                        <TextField
                            size='small'
                            sx={{ maxWidth: '195px' }}
                            value={textInput}
                            onChange={handleTextInputChange}
                            InputProps={{
                                style: {
                                    padding: 0,
                                },
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <Button
                                            size='small'
                                            onClick={handleNameChange}
                                        >
                                            OK
                                        </Button>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Typography>
                ) : (
                    <Typography
                        variant='subtitle2'
                        color={grey['700']}
                        sx={{ marginTop: '8px' }}
                    >
                        {user?.name}
                        <ModeEditIcon
                            sx={{ fontSize: '20px', marginLeft: '10px' }}
                            onClick={() => {
                                setIsEditing(true)
                            }}
                        />
                    </Typography>
                )}
                <Typography
                    variant='subtitle2'
                    color={grey['700']}
                    sx={{ marginTop: '4px' }}
                >
                    {user?.email}
                </Typography>
                <Typography
                    variant='subtitle2'
                    color={grey['700']}
                    sx={{ marginTop: '4px' }}
                >
                    {session?.user?.roles || ''}
                </Typography>
                {!session?.user?.roles?.includes(UserRole.ADMIN) && (
                    <Typography
                        variant='subtitle2'
                        color={grey['700']}
                        sx={{ marginTop: '4px' }}
                    >
                        {dictionary ? dictionary.profile.rating : ''} {": "} {user?.rating}
                    </Typography>
                )}
            </Box>

            {/* Right */}
            {!session?.user?.roles?.includes(UserRole.ADMIN) && (
                <Box
                    sx={{
                        marginTop: '50px',
                        marginX: { xs: '50px', sm: '50px', md: 0 },
                        width: 2/3,
                    }}
                    bgcolor='secondary.main'
                >
                    <Typography
                        variant='h4'
                        color={grey['700']}
                        sx={{ marginBottom: '30px' }}
                    >
                        {dictionary ? dictionary.profile.myReviews : ''}
                    </Typography>

                    {user ? (
                        <Reviews
                            params={{
                                lang: params.lang,
                                filter: [],
                                userId: user?._id,
                            }}
                        />
                    ) : (
                        'loading...'
                    )}
                </Box>
            )}
        </Box>
    )
}

const Page = WithAuth(Profile)
export default Page
