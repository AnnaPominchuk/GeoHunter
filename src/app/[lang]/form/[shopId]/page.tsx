'use client'

import {
    Stack,
    TextField,
    Typography,
    Button,
    Alert,
    Box,
    Autocomplete,
} from '@mui/material'
import { WithAuth } from '@/components/WithAuth'
import { Props } from '@/utils/Props'
import { useForm, FieldErrors } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { MuiFileInput } from 'mui-file-input'
import { useSession } from 'next-auth/react'
import { useState, useEffect, useRef } from 'react'

import L from 'leaflet'
import { MapContainer, TileLayer } from 'react-leaflet'

import { getDictionary, Dictionary, ConvertDictionary } from '@/lib/dictionary'
import React from 'react'

import $ from 'jquery'

type FormValues = {
    name: string
    address: string
    review: string
    userId: string
}

const header = new Headers({ 'Accept-Language': 'hu' })

function ShopForm({ params }: Props) {
    const updateAddress = async (lat: number, lon: number) => {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
            {
                method: 'GET',
                headers: header,
            }
        )

        const resJson = await res.json()
        setCurrentAddress(resJson.display_name)
        setAddressList([resJson.display_name])
    }

    const handleMarkerDrag = async (event: L.DragEndEvent) => {
        console.log(event)

        const newMarker = event.target

         console.log({newMarker:newMarker})
        const position = newMarker.getLatLng()
        newMarker.setLatLng(new L.LatLng(position.lat, position.lng), {
            draggable: 'true',
        })
        map.current?.panTo(new L.LatLng(position.lat, position.lng))

        setMarker(newMarker)

        await updateAddress(position.lat, position.lng)
    }

    const updateMarker = (lat: number | null, lon: number | null) => {
        if (marker) {
            map.current?.removeLayer(marker)
        }

        if (lat != null && lon != null) {
            const mar = L.marker([lat, lon], {
                draggable: true,
                icon: markerIcon,
            })
            mar.on('dragend', handleMarkerDrag)

            map.current?.addLayer(mar)
            setMarker(mar)
        } else {
            setMarker(null)
        }
    }

    const [dictionary, setDictionary] = useState<Dictionary>()
    useEffect(() => {
        const setDict = async () => {
            const dict = await getDictionary(params.lang)
            setDictionary(ConvertDictionary.toDictionary(JSON.stringify(dict)))
        }
        setDict()
    }, [params.lang])

    useEffect(() => {
        const setUserLoc = async () => {
            await navigator.geolocation.getCurrentPosition(
                (position) => {
                    updateAddress(
                        position.coords.latitude,
                        position.coords.longitude
                    )

                    updateMarker(
                        position.coords.latitude,
                        position.coords.longitude
                    )
                },
                (err) => console.error(err)
            )
        }

        setUserLoc()
    }, [])

    const { data: session } = useSession()
    const router = useRouter()
    const [containsErrors, setContainsErrors] = useState<boolean>(false)

    const form = useForm<FormValues>({
        defaultValues: {
            name: '',
            address: '',
            review: '',
        },
    })
    const { register, handleSubmit, formState, resetField } = form
    const { dirtyFields, isSubmitted } = formState
    const topRef = useRef<HTMLFormElement>(null)

    const [images, setImages] = useState<File[]>([])
    const [marker, setMarker] = useState<L.Marker | null>(null)
    const [addressList, setAddressList] = useState<string[]>([])
    const [currentAddress, setCurrentAddress] = useState<string>('')

    const position: L.LatLngExpression = [47.497913, 19.040236]

    const map = useRef<L.Map>(null)

    const handleImagesChange = (newValue: File[]) => {
        setImages(newValue)
    }

    const onSubmit = async (data: FormValues) => {
        await fetch(`../../../api/user/${session?.user?.email}`, {
            method: 'GET',
        })
            .then((res) => res.json())
            .then((users) => {
                if (users.status != 200) return Promise.reject('No users found')

                data.userId = users.data.users._id || ''
            })
            .then(() => {
                return fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${currentAddress}`,
                    {
                        method: 'GET',
                        headers: header,
                    }
                )
            })
            .then((res) => res.json())
            .then((coord) => {
                if (!coord.length) return Promise.reject('No coord found')

                return fetch('../../../api/review/upload', {
                    method: 'POST',
                    body: JSON.stringify({
                        review: data.review,
                        name: data.name,
                        userId: data.userId,
                        address: currentAddress,
                        latitude: coord[0].lat,
                        longitude: coord[0].lon,
                        shopId: params.shopId,
                    }),
                })
            })
            .then((res) => res.json())
            .then((resJson) => {
                const formData = new FormData()
                images.forEach((image) => {
                    formData.append('images', image)
                })
                formData.append('reviewId', resJson.reviewId)

                return fetch('../../../api/images/upload', {
                    method: 'POST',
                    body: formData,
                })
            })
            .catch((error) => {
                console.error(error)
                setContainsErrors(true)
            })
            .finally(() => {
                resetField('address')
                resetField('name')
                resetField('review')
                setImages([])

                topRef.current?.scrollIntoView()  
                return navigator.geolocation.getCurrentPosition(
                    (position) => {
                        updateAddress(
                            position.coords.latitude,
                            position.coords.longitude
                        )

                        updateMarker(
                            position.coords.latitude,
                            position.coords.longitude
                        )
                    },
                    (err) => console.error(err)
                )
            })
    }

    const onError = (error: FieldErrors<FormValues>) => {
        console.error(error)
    }

    const onCancel = () => {
        router.push(`/${params.lang}/map`)
    }

    const markerIcon: L.Icon = new L.Icon({
        iconUrl: '../../images/marker.png',
        iconSize: [30, 30],
    })

    const handleLocationChange = async (
        e: React.FocusEvent<HTMLDivElement, Element> | React.FocusEvent<HTMLInputElement, Element>
    ) => {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${(e.target as HTMLInputElement).value}`,
            {
                method: 'GET',
                headers: header,
            }
        )

        const resJson = await res.json()

        if (resJson.length) updateMarker(resJson[0].lat, resJson[0].lon)
        else updateMarker(null, null)
    }

    const handleAutocomplete = async (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${(e.target as HTMLInputElement).value}`,
            {
                method: 'GET',
                headers: header,
            }
        )

        const resJson = await res.json()
        console.log({ resJson: resJson })
        if (resJson.length) {
            setAddressList(
                Array.from(
                    new Set(resJson.map((item: any) => item.display_name))
                )
            )
        }

        setCurrentAddress((e.target as HTMLInputElement).value || '')
    }

    return (
        <form ref={topRef} onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <Stack
                sx={{ padding: '40px 20px' }}
                bgcolor={'secondary.main'}
                alignItems={'center'}
                justifyContent={'center'}
            >
                <Stack
                    spacing={4}
                    alignItems={'stretch'}
                    justifyContent={'center'}
                >
                    <Stack>
                        <Typography variant='h5' color='primary'>
                            {`Do you have any information about this object? Let us know and gain your points!`}
                        </Typography>
                    </Stack>

                    {isSubmitted && !containsErrors && (
                        <Alert
                            action={
                                <Button
                                    color='inherit'
                                    size='small'
                                    onClick={() => router.back()}
                                >
                                    {dictionary
                                        ? dictionary.navigation.goBackButton
                                        : ''}
                                </Button>
                            }
                        >
                            {dictionary ? dictionary.form.submittedMessage : ''}
                        </Alert>
                    )}

                    {isSubmitted && containsErrors && (
                        <Alert
                            severity='error'
                            action={
                                <Button
                                    color='error'
                                    size='small'
                                    onClick={() => router.back()}
                                >
                                    {dictionary
                                        ? dictionary.navigation.goBackButton
                                        : ''}
                                </Button>
                            }
                        >
                            {dictionary ? dictionary.form.backendError : ''}
                        </Alert>
                    )}

                    <Stack direction='row' spacing={2}>
                        <TextField
                            label={dictionary ? dictionary.common.name : ''}
                            variant='outlined'
                            color='primary'
                            type='text'
                            {...register('name')}
                            required
                        />
                    </Stack>

                    <Stack direction='row' spacing={2}>
                        <Autocomplete
                            freeSolo
                            filterOptions={(x) => x}
                            options={addressList}
                            value={currentAddress}
                            onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => handleAutocomplete(e)}
                            onBlur={(e: React.FocusEvent<HTMLDivElement, Element>) => handleLocationChange(e)}
                            sx={{ width: '100%' }}
                            renderOption={(props, option) => {
                                return (
                                    <li {...props} key={option.toString()}>
                                        {option}
                                    </li>
                                )
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label=''
                                    variant='outlined'
                                    color='primary'
                                    type='text'
                                    {...register('address')}
                                    onBlur={(e: React.FocusEvent<HTMLInputElement, Element>) => handleLocationChange(e)} // onBlur insted of onChange to fire handler only when input loses focus
                                    sx={{ width: '100%' }}
                                    required
                                />
                            )}
                        />
                    </Stack>

                    <Box
                        bgcolor='secondary.main'
                        sx={{ height: '50vh', display: 'flex' }}
                    >
                        <MapContainer
                            center={position}
                            zoom={8}
                            scrollWheelZoom={true}
                            style={{ height: '100%', width: '100%' }}
                            ref={map}
                        >
                            <TileLayer
                                attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                                url='https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=QLskrq94oAxIjpIUI8Pm'
                            />
                        </MapContainer>
                    </Box>

                    <MuiFileInput
                        multiple
                        value={images}
                        onChange={handleImagesChange}
                    />

                    <Stack>
                        <TextField
                            label={dictionary ? dictionary.form.review : ''}
                            variant='outlined'
                            color='primary'
                            multiline
                            minRows='8'
                            maxRows='8'
                            {...register('review')}
                            required
                        />
                    </Stack>

                    <Stack
                        direction='row'
                        spacing={2}
                        justifyContent={'center'}
                    >
                        <Button
                            variant='contained'
                            onClick={() => {
                                $('#submitbtn').trigger('click')
                            }}
                            component='label'
                            disabled={
                                !(
                                    dirtyFields.name &&
                                    dirtyFields.review &&
                                    marker
                                )
                            }
                        >
                            {dictionary ? dictionary.form.save : ''}
                        </Button>

                        <Button id='submitbtn' type='submit' hidden></Button>

                        <Button
                            variant='contained'
                            component='label'
                            onClick={onCancel}
                        >
                            {dictionary ? dictionary.form.cancel : ''}
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </form>
    )
}

const Form = WithAuth(ShopForm)
export default Form
