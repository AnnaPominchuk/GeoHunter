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

import withAuth from '../../components/withAuth';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import Review from '../../model/Review'
import User from '../../model/User'

import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import BakeryDiningOutlinedIcon from '@mui/icons-material/BakeryDiningOutlined';

const StyledButtonGroup = styled(ButtonGroup)({
  "& .MuiButtonGroup-grouped:not(:last-of-type)": {
    borderColor: "white"
  }
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  //...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.secondary,
  paddingLeft:'20px',
  //maxWidth: '400',
  minWidth: '800',
}));

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
    const [reviews, setReviews] = useState<Review[]>([])

    const [user, setUser] = useState<User|null>(null)

    useEffect(() => {
        async function geUser() {
            try {
                const resUser = await fetch(`/api/user/${session?.user?.email}`, {
                    method: 'GET'
                });
             
                const users = await resUser.json();
                if (users.status == 200) 
                    setUser(users.data.users)

                return users.data.users._id
            } catch (e) {
                console.log("Handle error", e)
            }
        }

        async function getReviews() {
            try {
                let id = await geUser()
                console.log(id)

                const res = await fetch(`/api/review/${id}`, {
                    method: 'GET'
                });
                const data = await res.json();

                // let reviewsList:Review[] = []
                // for(let reviewpData of data.reviews.reviews) {
                //     let review:Review = Convert.toReview(JSON.stringify(reviewpData))
                //     reviewsList.push(review)
                // }
                //setReviews(reviewsList)

                console.log(data)
                if (data.status == 200) setReviews(data.data.reviews);
            } catch (e) {
                console.log("Handle error", e)
            }
        }

        getReviews()
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
        <Box sx={{ marginTop: "50px", marginX: {xs:"50px", sm:"50px", md:0}, minWidth:1/2, maxWidth:2/3 }} bgcolor="secondary.main">

            <Typography variant='h4'color={grey['700']} sx={{ marginBottom: '30px' }}>
                My Reviews
            </Typography>

            { reviews?.map((review:Review) => (
                <Item>
                <Stack direction="row" justifyContent='space-between'>
                    <Stack direction="column">
                        <Typography variant='h6' color={grey['800']} sx={{marginBottom: '10px'}}>{review.name}</Typography>
                        <Typography>{review.review}</Typography>
                    </Stack>
                    <Chip 
                        size="small"
                        color={review.approved ? "success":"error"} 
                        label={review.approved ? "Approved":"Not Approved"} 
                    />
                </Stack>
                </Item>
              )) 
            }

        </Box>
    </Box>
  )
}

const Page = withAuth(myPage);
export default Page;