'use client'

import {withAuth} from './withAuth';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {useRouter} from 'next/navigation'

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

import { Convert, Review, ReviewStatus, ReviewStatusConvert } from '../../../model/Review'

import UserRole from '../../../utils/UserRole'

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getDictionary } from '@/lib/dictionary'
import { Locale } from '../../../../i18n.config'

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

const myReviews = ({
    params : { lang, filter, userId }
  }: {
    params: { lang: Locale, filter: String[], userId: String}
  }) => {

    const [ dictionary, setDictionary ] = useState<any>()
    useEffect(() => {
        const setDict = async() => {
        const dict = await getDictionary(lang)
        setDictionary(dict)
        }   

        setDict()
    }, [])

    const { data: session } = useSession();
    const router = useRouter()
    const [reviews, setReviews] = useState<Review[]>([])
    const [isAdmin, setIsAdmin] = useState<Boolean>(false)

    async function getReviews() {
            try {
                const res = await fetch(`../api/review/user/${props.userId || ''}`, {
                    method: 'GET'
                });
                const data = await res.json();

                let reviewsList:Review[] = []
                for(let reviewData of data.data.reviews) {
                    let review:Review = Convert.toReview(JSON.stringify(reviewData))
                    reviewsList.push(review)
                }

                setReviews(reviewsList.filter((review:Review) => {
                            if (!session?.user?.roles?.includes(UserRole.ADMIN)) return true;
                            return props.filter?.includes(review.status)
                        }))
            } catch (e) {
                console.log("Handle error", e)
            }
        }

    useEffect(() => {
        setIsAdmin(session?.user?.roles?.includes(UserRole.ADMIN))
        getReviews()
    },[filter])

    const handleApprove = async (id: String) => {
        const res = await fetch(`../api/review/${id || ''}`, {
                        method: 'PATCH',
                        body: JSON.stringify({status: ReviewStatus.Approved})
                    }).then( () => getReviews() );
    }

    const handleReject = async (id: String) => {
        const res = await fetch(`../api/review/${id || ''}`, {
                        method: 'PATCH',
                        body: JSON.stringify({status: ReviewStatus.Rejected})
                    }).then( () => getReviews() );
    }

    return (
        <>
            { reviews.length > 0 && reviews?.map((review:Review) => (
                        <Item key={review._id}>
                        <Stack 
                            direction= "row"
                            justifyContent='space-between'
                        >
                            <Stack direction="column">
                                <Typography variant='h6' color={grey['800']} sx={{marginBottom: '10px'}}>{review.name}</Typography>
                                <Typography>{review.review}</Typography>
                            </Stack>

                            { //!isAdmin &&
                                <Chip 
                                    size="small"
                                    color={ReviewStatusConvert.toColor(review.status)}
                                    label={ReviewStatusConvert.toText(review.status)}
                                />
                            }

                        </Stack>

                            {
                                isAdmin && 
                                <Stack direction="row" spacing={1} sx={{marginTop: '10px'}} justifyContent={'flex-end'} >
                                    <Button size='small' aria-label="fingerprint" color="primary" startIcon={<CheckCircleIcon />}
                                        onClick={() => handleApprove(review._id)}
                                    >
                                        { dictionary ? dictionary.reviews.approveButton : '' }
                                     </Button>
                                    <Button size='small' aria-label="fingerprint" color="primary"  startIcon={<BlockIcon />}
                                        onClick={() => handleReject(review._id)}
                                    >
                                        { dictionary ? dictionary.reviews.rejectButton : '' }
                                    </Button>

                                    <Button size='small' aria-label="fingerprint" color="primary" 
                                        endIcon={<ArrowForwardIcon />}
                                            onClick={() => router.push(`/${lang}/reviews/${review._id}`)}
                                    >
                                        { dictionary ? dictionary.reviews.seeMore : '' }
                                    </Button>
                                </Stack>
                            }

                        
                        </Item>
                )) 
            }

            { reviews.length <= 0 && 
                <Typography variant='h6' color={grey['600']} sx={{marginBottom: '10px'}}>
                    { dictionary ? dictionary.reviews.noReviews : '' }
                </Typography>
            }
        </>
);
}

const Reviews = withAuth(myReviews);
export default Reviews;