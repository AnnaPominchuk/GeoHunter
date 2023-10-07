'use client'

import {withAuthAdmin} from '../../../components/withAuth';
import Images from '../../../components/Images'

import { 
    Box,
    Typography,
    Stack,
    IconButton,
    Chip,
    Button
} from '@mui/material';

import { useState, useEffect } from 'react';
import {useRouter} from 'next/navigation'

import { Convert, Review, ReviewStatus, ReviewStatusConvert } from '../../../model/Review'

import { grey } from '@mui/material/colors'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';

const myPage = ({ params }: { params: { reviewId: String} }) => {
    const router = useRouter()

    const [review, setReview] = useState<Review|null>(null)

    async function getReview() {
            try {
                const res = await fetch(`/api/review/${params.reviewId || ''}`, {
                    method: 'GET'
                });
                const data = await res.json();

                let r:Review = Convert.toReview(JSON.stringify(data.review))
                setReview(r)
            } catch (e) {
                console.log("Handle error", e)
            }
    }

    useEffect(() => {
        getReview()
    },[])

    const handleApprove = async (id: String) => {
        const res = await fetch(`/api/review/${id || ''}`, {
                        method: 'PATCH',
                        body: JSON.stringify({status: ReviewStatus.Approved})
                    }).then( () => getReview() );
    }

    const handleReject = async (id: String) => {
        const res = await fetch(`/api/review/${id || ''}`, {
                        method: 'PATCH',
                        body: JSON.stringify({status: ReviewStatus.Rejected})
                    }).then( () => getReview() );
    }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-around',  flexDirection: {xs:'column', sm:'column', md:'row'}}} bgcolor="secondary.main">
       
        <Box sx={{ marginTop: "50px", marginX: {xs:"50px", sm:"50px", md:0}, minWidth:1/2, maxWidth:2/3 }} bgcolor="secondary.main">
            <Stack 
                direction= "row"
                justifyContent='space-between'
                sx={{marginBottom: '10px'}}
            >
                <IconButton 
                    aria-label="back"
                    onClick={() => router.back()}
                    sx={{marginLeft: "-40px"}} // TO DO: styles
                 >
                    <ArrowBackIcon />
                </IconButton>

                <Typography variant='h6' color={grey['800']}>Review details</Typography>
            </Stack>

            { review && <>
                <Stack direction="column"  sx={{marginBottom: "30px"}}>
                    <Typography variant='h6' color={grey['800']} sx={{marginBottom: "2px"}} >{review?.name}</Typography>

                    <Typography variant='subtitle' color={ReviewStatusConvert.toColor(review?.status)}>
                        {ReviewStatusConvert.toText(review?.status)}
                    </Typography>

                <Typography sx={{marginTop: "20px"}} >{review?.review}</Typography>
                </Stack>   

                <Stack alignItems={'center'}>
                    <Stack sx={{ maxWidth:2/3}}>
                        <Images reviewId={review?._id} />
                    </Stack>
                </Stack>        

                <Stack direction="row" sx={{marginTop: '30px'}} justifyContent={'flex-end'} >
                    <Button size='small' aria-label="fingerprint" color="primary" startIcon={<CheckCircleIcon />}
                        onClick={() => handleApprove(review?._id)}
                    >
                        Approve
                    </Button>
                    <Button size='small' aria-label="fingerprint" color="primary"  startIcon={<BlockIcon />}
                        onClick={() => handleReject(review?._id)}
                    >
                        Reject
                    </Button>

                </Stack>
            </>}
            
        </Box>
    </Box>
  )
}
const Page = withAuthAdmin(myPage);
export default Page;