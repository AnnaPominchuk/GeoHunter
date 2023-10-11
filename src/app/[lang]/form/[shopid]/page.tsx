'use client'

import { Stack, TextField, Typography, Button, Alert, Box } from '@mui/material';
import {withAuth} from '../../components/withAuth';
import { useForm, FieldErrors } from 'react-hook-form';
import { useRouter } from 'next/navigation'
import { MuiFileInput } from 'mui-file-input'
import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';

import L from 'leaflet'
import { MapContainer, TileLayer } from 'react-leaflet'

import { getDictionary } from '@/lib/dictionary'
import { Locale } from '../../../../../i18n.config'

type FormValues = {
    name: String,
    address: String,
    review: String,
    userId: String
}

const ShopForm = ({
    params : { lang, shopId }
  }: {
    params: { lang: Locale, shopId: string}
  }) => {

    const [ dictionary, setDictionary ] = useState<any>()
    useEffect(() => {
        const setDict = async() => {
        const dict = await getDictionary(lang)
        setDictionary(dict)
        }   

        setDict()
    }, [])

    const { data: session } = useSession();
    const router = useRouter()

    const form = useForm<FormValues>({
        defaultValues: {
            name: '',
            address: '',
            review: ''
        }
    })
    const { register, handleSubmit, formState, resetField } = form
    const { errors, dirtyFields, isSubmitted } = formState

    const [images, setImages] = useState<File[]>([])
    const [marker, setMarker] = useState(null)

    const map = useRef(null);

    const handleImagesChange = (newValue) => {
        setImages(newValue)
    }

    const onSubmit = async (data: FormValues) => {
        await fetch(`../api/user/${session?.user?.email}`, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(users => {
            if (users.status != 200) 
                return Promise.reject('No users found')

            const userId = users.data.users._id;
            console.log(userId)
            data.userId = users.data.users._id || ''
        })
        .then(() => {
            return fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${data.address}`, {
                method: 'GET'
            })
        })
        .then(res => res.json())
        .then((coord) => {
            if (!coord.length)
                return Promise.reject('No coord found')

            return fetch('../api/review/upload', {
                method: 'POST',
                body: JSON.stringify({ ...data, latitude: coord[0].lat, longitude: coord[0].lon, shopId: params.shopid})
            })
        })
        .then(res => res.json())
        .then(resJson => {
            const formData = new FormData();
            images.forEach((image) => {
            formData.append('images', image);
            })
            formData.append('reviewId', resJson.reviewId);

            return fetch('../api/images/upload', {
                method: 'POST',
                body: formData
            })
        })
        .catch(error => console.log(error))
        .finally(() => {
            resetField('address')
            resetField('name')
            resetField('review')
            setImages([])
        })
    }

    const onError = (error: FieldErrors<FormValues>) => {
        console.log(error)
    }

    const onCancel = () => {
        router.push(`/${lang}/map`)
    }

    const markerIcon:L.Icon = new L.Icon ({
        iconUrl: '/marker.png', 
        iconSize: [30, 30]
    });

    const updateAddress = async (lat: number, lon: number) => {
        const header = new Headers({'Accept-Language': 'hu, en;q=0.9'})
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
            method: 'GET',
            headers: header
        })

        const resJson = await res.json()
        form.setValue('address', resJson.display_name);
    }

    const handleMarkerDrag = async (event) => {
        var newMarker = event.target;
        var position = newMarker.getLatLng();
        newMarker.setLatLng(new L.LatLng(position.lat, position.lng),{draggable:'true'});
        map.current?.panTo(new L.LatLng(position.lat, position.lng))

        setMarker(newMarker)

        await updateAddress(position.lat, position.lng);
    }

    const handleLocationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${e.target.value}`, {
                method: 'GET'
            })

        const resJson = await res.json()

        if (marker) {
            map.current?.removeLayer(marker);
        }

        if (resJson.length) {
            const mar = new L.marker([resJson[0].lat, resJson[0].lon], {draggable:'true', icon: markerIcon});
            mar.on('dragend', handleMarkerDrag);

            map.current?.addLayer(mar);
            setMarker(mar)
        }
        else {
            setMarker(null)
        }
    }

    const position:L.LatLngExpression = [47.497913, 19.040236]

    return (
        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <Stack sx={{ padding: '40px 20px' }} bgcolor={'secondary.main'} alignItems={'center'} justifyContent={'center'}>
                <Stack
                    spacing={4}
                    alignItems={'stretch'}
                    justifyContent={'center'}>

                    <Stack>
                        <Typography variant='h5' color='primary'>
                            {`Do you have any information about this object? Let us know and gain your points!`}
                        </Typography>
                    </Stack>

                    { isSubmitted && <Alert
                        action={
                            <Button color="inherit" size="small" onClick={() => router.back()}>
                                { dictionary ? dictionary.navigation.goBackButton : '' }
                            </Button>
                        }
                    >
                        { dictionary ? dictionary.form.submittedMessage : '' }
                    </Alert> }

                    <Stack
                        direction='row'
                        spacing={2}>
                        <TextField
                            label={ dictionary ? dictionary.common.name : '' }
                            variant='outlined'
                            color='primary'
                            type='text'
                            {...register('name')}
                            required
                        />
                    </Stack>

                    <Stack
                        direction='row'
                        spacing={2}>

                        <TextField
                            label='Address'
                            variant='outlined'
                            color='primary'
                            type='text'
                            {...register('address')}
                            error={!!errors.longitude}
                            helperText={errors.longitude?.message}
                            onBlur={handleLocationChange} // onBlur insted of onChange to fire handler only when input loses focus
                            sx={{width:'100%'}}
                            required
                        />

                    </Stack>

                    <Box bgcolor="secondary.main" sx={{ height: "50vh", display: 'flex'}}> 
                        <MapContainer center={position} zoom={8} scrollWheelZoom={true} style={{height:'100%', width:'100%'}} ref={map}>
                        <TileLayer
                            attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                            url="https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=n0swbZslDTaWflzUvXMT"
                        />
                        </MapContainer>
                    </Box>

                    <MuiFileInput multiple value={images} onChange={handleImagesChange} />

                    <Stack>
                        <TextField
                            label={ dictionary ? dictionary.form.review : '' }
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
                        justifyContent={'center'}>
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={!(dirtyFields.name && dirtyFields.address && dirtyFields.review && marker)} 
                        >
                            { dictionary ? dictionary.form.save : '' }
                        </Button>
                        <Button
                            variant="contained"
                            onClick={onCancel}>
                            { dictionary ? dictionary.form.cancel : '' }
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </form>
    )
}

const Form = withAuth(ShopForm)
export default Form
