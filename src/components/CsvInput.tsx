'use client'

import VisuallyHiddenInput from '@/utils/VisuallyHiddenInput';
import { Button, Box, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'
import FileIcon from '@mui/icons-material/FilePresent'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';

const CsvInput = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((files: File[]) => {
    setSelectedFile(files[0])
  }, [])
  const { getRootProps, getInputProps } = useDropzone({onDrop})

  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('csvFile', file);
      const csvAsText = await file.text()
      const response = await fetch('/api/shop/upload-csv', {
        method: 'POST',
        body: csvAsText,
      });

      if (response.ok) {
        alert('CSV file uploaded successfully');
      } else {
        alert('Error uploading CSV file');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      await handleFileUpload(selectedFile);
      setSelectedFile(null)
    } else {
      alert('Please select a file to upload.');
    }
  }

  const clearSelectedFile = () => {
    setSelectedFile(null)
  }

  return (
    <Box sx={{ display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              flexDirection: 'column' }} 
              bgcolor="secondary.main">
      <Box sx={{ display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                flexDirection: 'column', 
                border: 2, 
                borderColor:'primary.main', 
                borderRadius: '16px',
                borderStyle:'dashed',
                height: '65vh',
                width: '80vw',
                minHeight:'250px',
                m: 5,
                p: 5,
                color:'primary.main',
                '&:hover': {cursor: 'pointer',
                            color:'primary.light',
                            borderColor:'primary.light'} }}
                {...getRootProps()}>
        <Typography sx={{ color: '#ccc', 
                          textAlign:'center' }}>
          Browse file to upload
        </Typography>
        <Box  sx={{ color:'inherit', 
                    width:'100%', 
                    height:'70%' }}>
          <VisuallyHiddenInput accept='csv' 
                                type="file" 
                                {...getInputProps()}/>
          <CloudUploadOutlinedIcon sx={{ color:'inherit', 
                                          width:'100%', 
                                          height:'100%'}}/>
        </Box>
        <Box sx={{ display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                flexDirection: 'column'}}>
          <Typography variant='body1' 
                      component='span' 
                      color='black' 
                      marginBottom={1}>
            <strong>Supported Files</strong>
          </Typography>
          <Typography variant='body2' 
                      component='span' 
                      color='black'>
            CSV
          </Typography>
        </Box>
      </Box>

    { selectedFile &&
      <Box sx={{ display:'flex', 
              justifyContent:'center', 
              alignItems:'center', 
              mb:5,
              width:'40vw'}}>
        <FileIcon sx={{ 
                  color:'primary.main', 
                  fontSize:'large'}}/>
        <Typography variant='body2' 
                    component='span' 
                    color='black' 
                    noWrap={true} 
                    marginLeft={1} 
                    marginRight={1}>
          { selectedFile.name }
        </Typography>
        <IconButton onClick={clearSelectedFile}
                    sx={{
                      fontSize:'large',
                      color:'primary.main'
                    }}>
          <DeleteIcon />
        </IconButton>
      </Box>
    }

      <Button component="label" 
              variant="contained" 
              disabled={!selectedFile} 
              onClick={handleUpload}>
        Upload data
      </Button>
    </Box>
  );
}

export default CsvInput;