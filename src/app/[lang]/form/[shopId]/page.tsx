'use client'

import {
    Stack,
    TextField,
    Typography,
    Button,
    Alert,
    Box,
    Autocomplete,
    Switch,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material'
import { WithAuthActivist } from '@/components/withAuth'
import { Props } from '@/utils/Props'
import { useForm, FieldErrors, Controller } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { MuiFileInput } from 'mui-file-input'
import { useSession } from 'next-auth/react'
import { useState, useEffect, useRef } from 'react'

import L from 'leaflet'
import { MapContainer, TileLayer } from 'react-leaflet'

import { getDictionary, Dictionary, ConvertDictionary } from '@/lib/dictionary'
import React from 'react'
import { grey } from '@mui/material/colors'
import { OverallRating } from '@/model/Review'

import $ from 'jquery'

type FormValues = {
    name: string
    address: string
    review: string
    userId: string
    hasSupportBoard: boolean
    hasOpenHoursAdded: boolean
    overallRating: string
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
        const newMarker = event.target

        const position = newMarker.getLatLng()
        newMarker.setLatLng(new L.LatLng(position.lat, position.lng), {
            draggable: 'true',
        })
        map.current?.panTo(new L.LatLng(position.lat, position.lng))

        marker.current = newMarker

        await updateAddress(position.lat, position.lng)
    }

    const updateMarker = (lat: number | null, lon: number | null) => {
        if (marker.current) {
            map.current?.removeLayer(marker.current)
        }

        if (lat != null && lon != null) {
            const mar = L.marker([lat, lon], {
                draggable: true,
                icon: markerIcon,
            })
            mar.on('dragend', handleMarkerDrag)

            map.current?.addLayer(mar)
            marker.current = mar
        } else {
            marker.current = null
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

    function getLabelForValue(value: string) {
        switch (value) {
            case OverallRating.Fine:
                return dictionary ? dictionary.form.dropDownOption1 : ''
            case OverallRating.MaybeSuspicious:
                return dictionary ? dictionary.form.dropDownOption2 : ''
            case OverallRating.ObviouslySuspicious:
                return dictionary ? dictionary.form.dropDownOption3 : ''
            default:
                return dictionary ? dictionary.form.overallRating : ''
        }
    }

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

    const [labelText, setLabelText] = useState('')
    useEffect(() => {
        setLabelText(dictionary ? dictionary.form.overallRating : '')
    }, [dictionary])

    const { data: session } = useSession()
    const router = useRouter()
    const [containsErrors, setContainsErrors] = useState<boolean>(false)

    const form = useForm<FormValues>({
        defaultValues: {
            name: '',
            address: '',
            review: '',
            hasSupportBoard: false,
            hasOpenHoursAdded: false,
            overallRating: '',
        },
    })
    const { register, handleSubmit, formState, resetField } = form
    const { dirtyFields, isSubmitted } = formState
    const topRef = useRef<HTMLFormElement>(null)

    const [images, setImages] = useState<File[]>([])
    const [supportingBoardImages, setSupportingBoardImages] = useState<File[]>(
        []
    )
    const [openingHoursImages, setOpeningHoursImages] = useState<File[]>(
        []
    )
    const [addressList, setAddressList] = useState<string[]>([])
    const [currentAddress, setCurrentAddress] = useState<string>('')

    const position: L.LatLngExpression = [47.497913, 19.040236]

    const map = useRef<L.Map>(null)
    const marker = useRef<L.Marker | null>(null)

    const handleImagesChange = (newValue: File[]) => {
        setImages(newValue)
    }

    const handleSupportingBoardImagesChange = (newValue: File[]) => {
        setSupportingBoardImages(newValue)
    }

    const onSubmit = async (data: FormValues) => {
        await fetch(`../../../api/user/email/${session?.user?.email}`, {
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

                const body = JSON.stringify({
                    review: data.review,
                    name: data.name,
                    userId: data.userId,
                    address: currentAddress,
                    latitude: coord[0].lat,
                    longitude: coord[0].lon,
                    shopId: params.shopId,
                    overallRating: data.overallRating,
                    hasSupportBoard: data.hasSupportBoard,
                    hasOpenHoursAdded: data.hasOpenHoursAdded
                })
                console.log(body)
                return fetch('../../../api/review/upload', {
                    method: 'POST',
                    body: body,
                })
            })
            .then((res) => res.json())
            .then((resJson) => {
                const formData = new FormData()
                images.forEach((image) => {
                    formData.append('images', image)
                })
                supportingBoardImages.forEach((image) => {
                    formData.append('images', image)
                })
                openingHoursImages.forEach((image) => {
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
                resetField('hasSupportBoard')
                resetField('hasOpenHoursAdded')
                resetField('overallRating')
                setLabelText(getLabelForValue(''))
                setImages([])
                setSupportingBoardImages([])

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
        e:
            | React.FocusEvent<HTMLDivElement, Element>
            | React.FocusEvent<HTMLInputElement, Element>
    ) => {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${
                (e.target as HTMLInputElement).value
            }`,
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
            `https://nominatim.openstreetmap.org/search?format=json&q=${
                (e.target as HTMLInputElement).value
            }`,
            {
                method: 'GET',
                headers: header,
            }
        )

        const resJson = await res.json()
        if (resJson.length) {
            setAddressList(
                Array.from(
                    new Set(
                        resJson.map(
                            (item: { display_name: string }) =>
                                item.display_name
                        )
                    )
                )
            )
        }

        setCurrentAddress((e.target as HTMLInputElement).value || '')
    }

    const getDisabledCondition = () => {
        return !(
            dirtyFields.name &&
            marker.current &&
            dirtyFields.overallRating &&
            (!dirtyFields.hasSupportBoard || supportingBoardImages.length) &&
            (!dirtyFields.hasOpenHoursAdded || openingHoursImages.length) &&
            (dirtyFields.review ||
                form.getValues('overallRating') === OverallRating.Fine)
        )
    }

    return (
        <form
            ref={topRef}
            onSubmit={handleSubmit(onSubmit, onError)}
            noValidate
        >
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
                    <Stack spacing={1}>
                        <Typography variant='body1' color={grey['700']}>
                            {dictionary
                                ? dictionary.form.hasSupportBoadrText
                                : ''}
                        </Typography>
                        <FormControl>
                            <Switch
                                color='primary'
                                size='medium'
                                {...register('hasSupportBoard')}
                            />
                        </FormControl>
                    </Stack>
                    {form.getValues('hasSupportBoard') && (
                        <Stack spacing={2}>
                            <Typography variant='body1' color={grey['700']}>
                                {dictionary
                                    ? `${dictionary.form.provideSBPhotoText}*`
                                    : ''}
                            </Typography>
                            <MuiFileInput
                                multiple
                                value={supportingBoardImages}
                                onChange={handleSupportingBoardImagesChange}
                                inputProps={{ accept: 'image/*' }}
                                onDrop={(e) => e.preventDefault()}
                            />
                        </Stack>
                    )}

                    <Stack spacing={1}>
                        <Typography variant='body1' color={grey['700']}>
                            {dictionary
                                ? dictionary.form.hasOpenHoursText
                                : ''}
                        </Typography>
                        <FormControl>
                            <Switch
                                color='primary'
                                size='medium'
                                {...register('hasOpenHoursAdded')}
                            />
                        </FormControl>
                    </Stack>
                    {form.getValues('hasOpenHoursAdded') && (
                        <Stack spacing={2}>
                            <Typography variant='body1' color={grey['700']}>
                                {dictionary
                                    ? `${dictionary.form.provideOpenHoursPhotoText}*`
                                    : ''}
                            </Typography>
                            <MuiFileInput
                                multiple
                                value={openingHoursImages}
                                onChange={(newValue: File[]) => setOpeningHoursImages(newValue)}
                                inputProps={{ accept: 'image/*' }}
                                onDrop={(e) => e.preventDefault()}
                            />
                        </Stack>
                    )}

                    <Stack direction='row' spacing={2}>
                        <Autocomplete
                            freeSolo
                            filterOptions={(x) => x}
                            options={addressList}
                            value={currentAddress}
                            onKeyUp={(
                                e: React.KeyboardEvent<HTMLInputElement>
                            ) => handleAutocomplete(e)}
                            onBlur={(
                                e: React.FocusEvent<HTMLDivElement, Element>
                            ) => handleLocationChange(e)}
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
                                    label={
                                        dictionary
                                            ? `${dictionary.form.address}`
                                            : ''
                                    }
                                    variant='outlined'
                                    color='primary'
                                    type='text'
                                    {...register('address')}
                                    onBlur={(
                                        e: React.FocusEvent<
                                            HTMLInputElement,
                                            Element
                                        >
                                    ) => handleLocationChange(e)} // onBlur insted of onChange to fire handler only when input loses focus
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

                    <Stack spacing={2}>
                        <Typography variant='body1' color={grey['700']}>
                            {dictionary
                                ? dictionary.form.provideMorePhotosText
                                : ''}
                        </Typography>

                        <MuiFileInput
                            multiple
                            value={images}
                            onChange={handleImagesChange}
                            inputProps={{ accept: 'image/*' }}
                            onDrop={(e) => e.preventDefault()}
                        />
                    </Stack>

                    <FormControl fullWidth required>
                        <InputLabel>{labelText}</InputLabel>
                        <Controller
                            name='overallRating'
                            control={form.control}
                            defaultValue='0'
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e)
                                        setLabelText(
                                            getLabelForValue(e.target.value)
                                        )
                                        if (
                                            e.target.value ===
                                                OverallRating.Fine ||
                                            e.target.value === ''
                                        )
                                            resetField('review')
                                    }}
                                    label={labelText}
                                >
                                    <MenuItem value=''>
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={OverallRating.Fine}>
                                        {dictionary
                                            ? dictionary.form.dropDownOption1
                                            : ''}
                                    </MenuItem>
                                    <MenuItem
                                        value={OverallRating.MaybeSuspicious}
                                    >
                                        {dictionary
                                            ? dictionary.form.dropDownOption2
                                            : ''}
                                    </MenuItem>
                                    <MenuItem
                                        value={
                                            OverallRating.ObviouslySuspicious
                                        }
                                    >
                                        {dictionary
                                            ? dictionary.form.dropDownOption3
                                            : ''}
                                    </MenuItem>
                                </Select>
                            )}
                        />
                    </FormControl>

                    {(form.getValues('overallRating') ===
                        OverallRating.MaybeSuspicious ||
                        form.getValues('overallRating') ===
                            OverallRating.ObviouslySuspicious) && (
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
                    )}

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
                            disabled={getDisabledCondition()}
                        >
                            {dictionary ? dictionary.form.save : ''}
                        </Button>

                        <Button
                            id='submitbtn'
                            type='submit'
                            sx={{ display: 'none' }}
                        ></Button>

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

const Form = WithAuthActivist(ShopForm)
export default Form
