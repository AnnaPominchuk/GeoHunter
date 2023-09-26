'use client'

import { Stack, TextField, Typography, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import withAuth from '../../../components/withAuth';
import VisuallyHiddenInput from '@/utils/VisuallyHiddenInput';
import { useForm, FieldErrors } from 'react-hook-form';
import { useRouter } from 'next/navigation'

type FormValues = {
    name: String,
    latitude: Number,
    longitude: Number,
    review: String
}

const ShopForm = ({ params }: { params: { shopid: String} }) => {

    const router = useRouter()

    const form = useForm<FormValues>({
        defaultValues: {
            name: '',
            latitude: '',
            longitude: '',
            review: ''
        }
    })
    const { register, handleSubmit, formState, watch } = form
    const { errors, dirtyFields } = formState

    const watchLatitude = watch('latitude')
    const watchLongitude = watch('longitude')

    const onSubmit = async (data: FormValues) => {
        const res = await fetch('/api/review/upload', {
            method: 'POST',
            body: JSON.stringify({ ...data, shopID: params.shopid, userID: ''})
        })
        const error = await res.json()
        console.log(error)
    }

    const onError = (error: FieldErrors<FormValues>) => {
        console.log(error)
    }

    const onCancel = () => {
        router.push('/map')
    }

    return (
        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <Stack sx={{ padding: '20px 20px' }} bgcolor={'secondary.main'} height={'100vh'} alignItems={'center'} justifyContent={'center'}>
                <Stack
                    spacing={4}
                    alignItems={'stretch'}
                    justifyContent={'center'}>

                    <Stack>
                        <Typography variant='h5' color='primary'>
                            {`Do you have any information about this object? Let us know and gain your points!`}
                        </Typography>
                    </Stack>

                    <Stack
                        direction='row'
                        spacing={2}>
                        <TextField
                            label='Name'
                            variant='outlined'
                            color='primary'
                            {...register('name')}
                        />
                    </Stack>

                    <Stack
                        direction='row'
                        spacing={2}>
                        <TextField
                            label='Latitude'
                            variant='outlined'
                            color='primary'
                            type='number'
                            {...register('latitude', {
                                pattern: {
                                    value: /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/,
                                    message: 'Enter a valid number from -90 to 90'
                                },
                                validate: {
                                    isLongitudeSet: (fieldValue) => {
                                        console.log(fieldValue)
                                        return fieldValue == 0 || watchLongitude != 0 || 'Longitude and latitude values should both be provided'
                                    }
                                }
                            })
                            }
                            error={!!errors.latitude}
                            helperText={errors.latitude?.message} />

                        <TextField
                            label='Longitude'
                            variant='outlined'
                            color='primary'
                            type='number'
                            {...register('longitude', {
                                pattern: {
                                    value: /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/,
                                    message: 'Enter a valid number from -180 to 180'
                                },
                                validate: {
                                    isLatitudeSet: (fieldValue) => {
                                        return fieldValue == 0 || watchLatitude != 0 || 'Longitude and latitude values should both be provided'
                                    }
                                }
                            }
                            )}
                            error={!!errors.longitude}
                            helperText={errors.longitude?.message} />
                    </Stack>

                    <Stack
                        direction='row'
                        spacing={2}>
                        <Button
                            component="label"
                            variant="contained"
                            startIcon={<CloudUploadIcon />}>
                            Select files
                            <VisuallyHiddenInput type="file" />
                        </Button>
                        <Typography color='black'>
                        </Typography>
                    </Stack>

                    <Stack>
                        <TextField
                            label='Review'
                            variant='outlined'
                            color='primary'
                            multiline
                            minRows='8'
                            maxRows='8'
                            {...register('review')} />
                    </Stack>

                    <Stack
                        direction='row'
                        spacing={2}
                        justifyContent={'center'}>
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={JSON.stringify(dirtyFields) === '{}'}>
                            Save
                        </Button>
                        <Button
                            variant="contained"
                            onClick={onCancel}>
                            Cancel
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </form>
    )
}

const Form = withAuth(ShopForm)
export default Form
