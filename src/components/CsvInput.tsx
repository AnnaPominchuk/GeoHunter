'use client'

import VisuallyHiddenInput from '@/utils/VisuallyHiddenInput';
import { Button, Box, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState, ChangeEvent} from 'react'

const CsvInput = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileUpload = async (file:File) => {
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
  
    const handleFileChange = (event:ChangeEvent<HTMLInputElement>) => {
      setSelectedFile(event.target.files? event.target.files[0] : null);
    };
  
    const handleUpload = () => {
      if (selectedFile) {
        handleFileUpload(selectedFile);
      } else {
        alert('Please select a file to upload.');
      }
    }
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection:'column'}} bgcolor="secondary.main">
            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                Select file
                <VisuallyHiddenInput type="file" onChange={(e) => handleFileChange(e)}/>
            </Button>
            <Typography color='black'>
                {selectedFile ? selectedFile.name : null}
            </Typography>
            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} disabled={!selectedFile} onClick={handleUpload}>
                Upload data
            </Button>
        </Box>
    );
}

export default CsvInput;