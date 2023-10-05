'use client'

import {withAuthAdmin} from '../../components/withAuth';

import { 
    Box,
    Typography,
    Stack,
    IconButton,
    Menu,
    FormControlLabel,
    FormGroup,
    Checkbox,
    Button
} from '@mui/material';

import { useState } from 'react';

import Reviews from '../../components/Reviews';

import { ReviewStatus } from '../../model/Review'

import { grey } from '@mui/material/colors'
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const myPage = () => {
    const [filter, setFilter] = useState<String[]>(['InReview'])
    const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
    const filterOpen = Boolean(filterAnchor);

    const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setFilterAnchor(event.currentTarget);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked)
            setFilter([...filter, ...[event.target.name]])
        else
            setFilter([...filter.filter((item) => item != event.target.name)])
    };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-around',  flexDirection: {xs:'column', sm:'column', md:'row'}}} bgcolor="secondary.main">
       
        <Box sx={{ marginTop: "50px", marginX: {xs:"50px", sm:"50px", md:0}, minWidth:1/2, maxWidth:2/3 }} bgcolor="secondary.main">
            <Stack 
                direction= "row"
                justifyContent='space-between'
                sx={{marginBottom: '10px'}}
            >
                <Typography variant='h5' color={grey['800']}>Reviews</Typography>
                <IconButton 
                    aria-label="filter"
                    onClick={handleFilterClick}
                >
                    <FilterAltIcon />
                </IconButton>
            </Stack>

            <Menu
                id="mobile-menu" 
                anchorEl={filterAnchor}
                open={filterOpen}
                onClose={() => setFilterAnchor(null)}
              >
                <FormGroup sx={{padding: '8px' }}>
                    <FormControlLabel 
                        control={<Checkbox checked={filter.includes(ReviewStatus.InReview)} name={ReviewStatus.InReview} onChange={handleChange} 
                            size="small" />} 
                        label="In Review" 
                    />
                    <FormControlLabel 
                        control={<Checkbox checked={filter.includes(ReviewStatus.Approved)} name={ReviewStatus.Approved} onChange={handleChange}
                            size="small" />} 
                        label="Approved" 
                    />
                    <FormControlLabel 
                        control={<Checkbox checked={filter.includes(ReviewStatus.Rejected)} name={ReviewStatus.Rejected} onChange={handleChange}
                            size="small" />} 
                        label="Rejected" 
                    />
                </FormGroup>
                <Button onClick={() => setFilterAnchor(null)} >Apply</Button>
              </Menu> 
            
            <Reviews filter={filter} />
        </Box>
    </Box>
  )
}
const Page = withAuthAdmin(myPage);
export default Page;