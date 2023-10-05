'use client'

import {withAuth} from './withAuth';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import { 
    Typography,
    Paper,
    Stack,
    Chip,
    Button,
    IconButton
} from '@mui/material';

import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors'

import { Convert, Review, ReviewStatus } from '../model/Review'

import UserRole from '../utils/UserRole'

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

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

const myReviews = ( props ) => {
    const { data: session } = useSession();
    const [reviews, setReviews] = useState<Review[]>([])
    const [isAdmin, setIsAdmin] = useState<Boolean>(false)

    useEffect(() => {
        async function getReviews() {
            try {
                console.log(props.userId)

                const res = await fetch(`/api/review/user/${props.userId || ''}`, {
                    method: 'GET'
                });
                const data = await res.json();
                console.log(data.data)

                let reviewsList:Review[] = []
                for(let reviewData of data.data.reviews) {
                    console.log(JSON.stringify(reviewData))
                    let review:Review = Convert.toReview(JSON.stringify(reviewData))
                    reviewsList.push(review)
                }
                setReviews(reviewsList)
            } catch (e) {
                console.log("Handle error", e)
            }
        }

        setIsAdmin(session?.user?.roles?.includes(UserRole.ADMIN))

        getReviews()
    },[])

    const handleApprove = async (id: String) => {
        const res = await fetch(`/api/review/${id || ''}`, {
                        method: 'PATCH',
                        body: JSON.stringify({status: ReviewStatus.Approved})
                    });
    }

    const handleReject = async (id: String) => {
        const res = await fetch(`/api/review/${id || ''}`, {
                        method: 'PATCH',
                        body: JSON.stringify({status: ReviewStatus.Rejected})
                    });
    }

    console.log(props.filter)

    return (
        <>
            { reviews?.filter((review:Review) => {
                            if (!isAdmin) return true;
                            return props.filter?.includes(review.status)
                        })
                       .map((review:Review) => (
                        <Item key={review._id}>
                        <Stack 
                            direction= { isAdmin? "column" :"row" }
                            justifyContent='space-between'
                        >
                            <Stack direction="column">
                                <Typography variant='h6' color={grey['800']} sx={{marginBottom: '10px'}}>{review.name}</Typography>
                                <Typography>{review.review}</Typography>
                            </Stack>

                            { !isAdmin &&
                                <Chip 
                                    size="small"
                                    color={review.status === ReviewStatus.Approved? "success":"error"} 
                                    label={review.status === ReviewStatus.Approved? "Approved":"Not Approved"} 
                                />
                            }

                            {
                                isAdmin && 
                                <Stack direction="row" sx={{marginTop: '10px'}} justifyContent={'flex-end'} >
                                    <Button size='small' aria-label="fingerprint" color="primary" startIcon={<CheckCircleIcon />}
                                        onClick={() => handleApprove(review._id)}
                                    >
                                     </Button>
                                    <Button size='small' aria-label="fingerprint" color="primary"  startIcon={<BlockIcon />}
                                        onClick={() => handleReject(review._id)}
                                    >
                                    </Button>

                                    <Button size='small' aria-label="fingerprint" color="primary" 
                                        endIcon={<ArrowForwardIcon />}
                                            onClick={() => {}}
                                    >
                                            See more
                                    </Button>
                                </Stack>
                            }

                        </Stack>
                        </Item>
                )) 
            }
        </>
);
}

const Reviews = withAuth(myReviews);
export default Reviews;