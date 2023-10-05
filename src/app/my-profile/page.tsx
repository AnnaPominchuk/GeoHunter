'use client'

import { 
    Box,
    Button,
    ButtonGroup,
    Typography,
    Paper,
    Stack,
    Chip,
    Rating
} from '@mui/material';

import Image from "next/image";

import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors'

import {withAuth} from '../../components/withAuth';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import Reviews from '../../components/Reviews';

import UserRole from '../../utils/UserRole'
import User from '../../model/User'

import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import BakeryDiningOutlinedIcon from '@mui/icons-material/BakeryDiningOutlined';

const StyledButtonGroup = styled(ButtonGroup)({
  "& .MuiButtonGroup-grouped:not(:last-of-type)": {
    borderColor: "white"
  }
});


const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#ff6d75',
  },
  '& .MuiRating-iconHover': {
    color: '#ff3d47',
  },
});

const myPage = () => {
    const { data: session } = useSession();

    const [user, setUser] = useState<User|null>(null)

    useEffect(() => {
        async function getUser() {
            try {
                const resUser = await fetch(`/api/user/${session?.user?.email}`, {
                    method: 'GET'
                });
             
                const users = await resUser.json();
                if (users.status == 200) 
                    setUser(users.data.users)

            } catch (e) {
                console.log("Handle error", e)
            }
        }

        getUser()
    },[])

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
                {user?.name}
            </Typography>
            <Typography variant='subtitle2'color={grey['700']} sx={{ marginTop: '4px' }}>
                {user?.email}
            </Typography>
            <Typography variant='subtitle2'color={grey['700']} sx={{ marginTop: '4px' }}>
                {session?.user?.roles || ""}
            </Typography>
            <StyledRating
                    name="rating"
                    defaultValue={user?.rating}
                    readOnly
                    getLabelText={(value: number) => `${value} Rating${value !== 1 ? 's' : ''}`}
                    precision={0.5}
                    sx={{ marginTop: '4px' }}
                    icon={<BakeryDiningIcon fontSize="inherit" />}
                    emptyIcon={<BakeryDiningOutlinedIcon fontSize="inherit" />}
            />
        </Box>

        {/* Right */}
        { !session?.user?.roles?.includes(UserRole.ADMIN) &&
            <Box sx={{ marginTop: "50px", marginX: {xs:"50px", sm:"50px", md:0}, minWidth:1/2, maxWidth:2/3 }} bgcolor="secondary.main">

                <Typography variant='h4'color={grey['700']} sx={{ marginBottom: '30px' }}>
                    My Reviews
                </Typography>

                { user ? <Reviews userId={user?._id} /> : 'loading...' }

            </Box>
        }
    </Box>
  )
}

const Page = withAuth(myPage);
export default Page;