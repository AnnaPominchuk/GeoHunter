'use client'

import VisuallyHiddenInput from '@/utils/VisuallyHiddenInput'
import { Button, Box, Typography, IconButton, Alert } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import FileIcon from '@mui/icons-material/FilePresent'
import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import { useRouter } from 'next/navigation'
import { getDictionary, Dictionary, ConvertDictionary } from '@/lib/dictionary'
import { Props } from '@/utils/Props'

const CsvInput = ({ params }: Props) => {
    const [dictionary, setDictionary] = useState<Dictionary>()
    useEffect(() => {
        const setDict = async () => {
            const dict = await getDictionary(params.lang)
            setDictionary(ConvertDictionary.toDictionary(JSON.stringify(dict)))
        }

        setDict()
    }, [params.lang])

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isError, setIsError] = useState(false)

    const router = useRouter()

    const onDrop = useCallback((files: File[]) => {
        setSelectedFile(files[0])
        setIsSubmitted(false)
    }, [])
    const { getRootProps, getInputProps } = useDropzone({ onDrop })

    const handleFileUpload = async (file: File) => {
        try {
            const formData = new FormData()
            formData.append('csvFile', file)
            const csvAsText = await file.text()
            const response = await fetch('../api/shop/upload-csv', {
                method: 'POST',
                body: csvAsText,
            })

            if (response.ok) {
                setIsSubmitted(true)
            } else {
                setIsError(true)
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const handleUpload = async () => {
        if (selectedFile) {
            await handleFileUpload(selectedFile)
            setSelectedFile(null)
        }
    }

    const clearSelectedFile = () => {
        setSelectedFile(null)
        setIsSubmitted(false)
        setIsError(false)
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            }}
            bgcolor='secondary.main'
        >
            {isSubmitted && !isError && (
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
                    sx={{ marginTop: 4 }}
                >
                    {dictionary
                        ? dictionary.csvUploadComponent.successMessage
                        : ''}
                </Alert>
            )}
            {isError && (
                <Alert
                    severity='error'
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
                    sx={{ marginTop: 4 }}
                >
                    {dictionary
                        ? dictionary.csvUploadComponent.errorMessage
                        : ''}
                </Alert>
            )}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'column',
                    border: 2,
                    borderColor: 'primary.main',
                    borderRadius: '16px',
                    borderStyle: 'dashed',
                    height: '65vh',
                    width: '80vw',
                    minHeight: '250px',
                    m: 4,
                    p: 5,
                    color: 'primary.main',
                    '&:hover': {
                        cursor: 'pointer',
                        color: 'primary.light',
                        borderColor: 'primary.light',
                    },
                }}
                {...getRootProps()}
            >
                <Typography sx={{ color: '#ccc', textAlign: 'center' }}>
                    {dictionary ? dictionary.csvUploadComponent.capture : ''}
                </Typography>
                <Box sx={{ color: 'inherit', width: '100%', height: '70%' }}>
                    <VisuallyHiddenInput type='file' {...getInputProps()} />
                    <CloudUploadOutlinedIcon
                        sx={{ color: 'inherit', width: '100%', height: '100%' }}
                    />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <Typography
                        variant='body1'
                        component='span'
                        color='black'
                        marginBottom={1}
                    >
                        <strong>
                            {dictionary
                                ? dictionary.csvUploadComponent.supportedFiles
                                : ''}
                        </strong>
                    </Typography>
                    <Typography variant='body2' component='span' color='black'>
                        CSV
                    </Typography>
                </Box>
            </Box>

            {selectedFile && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mb: 5,
                        width: '40vw',
                    }}
                >
                    <FileIcon
                        sx={{
                            color: 'primary.main',
                            fontSize: 'large',
                        }}
                    />
                    <Typography
                        variant='body2'
                        component='span'
                        color='black'
                        noWrap={true}
                        marginLeft={1}
                        marginRight={1}
                    >
                        {selectedFile.name}
                    </Typography>
                    <IconButton
                        onClick={clearSelectedFile}
                        sx={{
                            fontSize: 'large',
                            color: 'primary.main',
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            )}

            <Button
                component='label'
                variant='contained'
                disabled={!selectedFile}
                onClick={handleUpload}
            >
                {dictionary ? dictionary.csvUploadComponent.uploadButton : ''}
            </Button>
        </Box>
    )
}

export default CsvInput
