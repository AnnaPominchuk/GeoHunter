'use client'

import { 
    Box,
    Button,
    ButtonGroup,
    Typography,
    Paper,
    Stack
} from '@mui/material';

import Image from "next/image";

import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors'

import withAuth from '../../components/withAuth';

const StyledButtonGroup = styled(ButtonGroup)({
  "& .MuiButtonGroup-grouped:not(:last-of-type)": {
    borderColor: "white"
  }
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  //maxWidth: '400',
  minWidth: '800',
}));

const myPage = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-around',  flexDirection: {xs:'column', sm:'column', md:'row'}}} bgcolor="secondary.main">

        {/* Left */}
        <Box sx={{ margin: "50px"}} bgcolor="secondary.main">
            <div style={{ borderRadius: '50%', overflow: 'hidden', width: '200px', height: '200px' }}>
                <Image
                    src='/../../no-pic-prof.jpeg'
                    alt=""
                    width={200}
                    height={200}    
                />
            </div>

            <StyledButtonGroup
                sx={{ marginTop:'10px' }}
                variant="text"
            >
                <Button 
                    onClick={() => {}}
                >
                    Update profile photo
                </Button>
            </StyledButtonGroup>

            <Typography variant='subtitle2'color={grey['700']} sx={{ marginTop: '8px' }}>
                Yuliia Pominchuk
            </Typography>
            <Typography variant='subtitle2'color={grey['700']} sx={{ marginTop: '4px' }}>
                User email
            </Typography>
            <Typography variant='subtitle2'color={grey['700']} sx={{ marginTop: '4px' }}>
                Role
            </Typography>
            <Typography variant='subtitle2'color={grey['700']} sx={{ marginTop: '4px' }}>
                Rating
            </Typography>
        </Box>

        {/* Right */}
        <Box sx={{ marginTop: "50px", marginX: {xs:"50px", sm:"50px", md:0}, minWidth:1/2 }} bgcolor="secondary.main">

            <Typography variant='h4'color={grey['700']} sx={{ marginBottom: '30px' }}>
                Reviews
            </Typography>

            <Item>
                <Stack direction="row">
                    <Typography noWrap>Review 1</Typography>
                </Stack>
            </Item>
            <Item>
                <Stack direction="row">
                    <Typography noWrap>Review 2</Typography>
                </Stack>
            </Item>
            <Item>
                <Stack direction="row">
                    <Typography noWrap>Review 3</Typography>
                </Stack>
            </Item>

        </Box>
    </Box>
  )
}

const Page = withAuth(myPage);
export default Page;