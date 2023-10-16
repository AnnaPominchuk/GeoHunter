'use client'

import { WithAuth } from './WithAuth'
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'

import { 
    Typography,
    Paper,
    Stack,
    Chip,
    Button
} from '@mui/material';

import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors'

import { Convert, Review, ReviewStatus, ReviewStatusConvert } from '@/model/Review'

import UserRole from '@/utils/UserRole'

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getDictionary } from '@/lib/dictionary'
import { Locale } from '@/config/i18n.config'

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

const MyReviews = ({
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
    }, [lang])

    const { data: session } = useSession();
    const router = useRouter()
    const [reviews, setReviews] = useState<Review[]>([])

    async function getReviews() {
            try {
                const res = await fetch(`../api/review/user/${userId || ''}`, {
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
                            return filter?.includes(review.status)
                        }))
            } catch (e) {
                console.error("Handle error", e)
            }
        }

    useEffect(() => {
        getReviews()
    },[filter, session?.user?.roles, getReviews])

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

                            <Chip 
                                size="small"
                                color={ReviewStatusConvert.toColor(review.status, false)}
                                label={ReviewStatusConvert.toText(review.status)}
                            />

                        </Stack>

                            <Stack direction="row" spacing={1} sx={{marginTop: '10px'}} justifyContent={'flex-end'} >
                                <Button size='small' aria-label="fingerprint" color="primary" 
                                    endIcon={<ArrowForwardIcon />}
                                        onClick={() => router.push(`/${lang}/reviews/${review._id}`)}
                                >
                                    { dictionary ? dictionary.reviews.seeMore : '' }
                                </Button>
                            </Stack>
                        
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

const Reviews = WithAuth(MyReviews);
export default Reviews;