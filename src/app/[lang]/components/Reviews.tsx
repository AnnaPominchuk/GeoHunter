'use client'

import { WithAuth } from './WithAuth'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { Typography, Paper, Stack, Chip, Button, Hidden } from '@mui/material'

import { styled } from '@mui/material/styles'
import { grey } from '@mui/material/colors'

import { Convert, Review, ReviewStatusConvert } from '@/model/Review'

import UserRole from '@/utils/UserRole'

import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { getDictionary, Dictionary, ConvertDictionary } from '@/lib/dictionary'
import { Locale } from '@/config/i18n.config'

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    //...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    paddingLeft: '20px',
    //maxWidth: '400',
    minWidth: '800',
}))

const MyReviews = ({
    params: { lang, filter, userId },
}: {
    params: { lang: Locale; filter: string[]; userId: string }
}) => {
    const [dictionary, setDictionary] = useState<Dictionary>()
    useEffect(() => {
        const setDict = async () => {
            const dict = await getDictionary(lang)
            setDictionary(ConvertDictionary.toDictionary(JSON.stringify(dict)))
        }

        setDict()
    }, [lang])

    const { data: session } = useSession()
    const router = useRouter()
    const [reviews, setReviews] = useState<Review[]>([])

    async function getReviews() {
        try {
            const res = await fetch(`../api/review/user/${userId || ''}`, {
                method: 'GET',
            })
            const data = await res.json()

            const reviewsList: Review[] = []
            for (const reviewData of data.data.reviews) {
                const review: Review = Convert.toReview(
                    JSON.stringify(reviewData)
                )
                reviewsList.push(review)
            }

            setReviews(
                reviewsList.filter((review: Review) => {
                    if (!session?.user?.roles?.includes(UserRole.ADMIN))
                        return true
                    return filter?.includes(review.status)
                })
            )
        } catch (e) {
            console.error('Handle error', e)
        }
    }

    useEffect(() => {
        getReviews()
    }, [filter, session?.user?.roles])

    return (
        <>
            {reviews.length > 0 &&
                reviews?.map((review: Review) => (
                    <Item key={review._id}>
                        <Stack direction='row' justifyContent='space-between'>
                            <Stack 
                                direction='column' 
                                maxHeight={170}
                                overflow={"hidden"}
                            >
                                <Typography
                                    variant='h6'
                                    color={grey['800']}
                                    sx={{ marginBottom: '10px' }}
                                    className={
                                        review.review.length > 80
                                            ? 'fadding-text-h'
                                            : ''
                                    }
                                >
                                    {review.name}
                                </Typography>
                                <Typography
                                    className={
                                        review.review.length > 400
                                            ? 'fadding-text'
                                            : ''
                                    }
                                >
                                    {review.review}
                                </Typography>
                            </Stack>

                            <Chip
                                size='small'
                                color={ReviewStatusConvert.toColor(
                                    review.status
                                )}
                                label={ReviewStatusConvert.toText(
                                    review.status
                                )}
                                sx={{marginLeft:"5px"}}
                            />
                        </Stack>

                        <Stack
                            direction='row'
                            spacing={1}
                            sx={{ marginTop: '10px' }}
                            justifyContent={'flex-end'}
                        >
                            <Button
                                size='small'
                                aria-label='fingerprint'
                                color='primary'
                                endIcon={<ArrowForwardIcon />}
                                onClick={() =>
                                    router.push(
                                        `/${lang}/reviews/${review._id}`
                                    )
                                }
                            >
                                {dictionary ? dictionary.reviews.seeMore : ''}
                            </Button>
                        </Stack>
                    </Item>
                ))}

            {reviews.length <= 0 && (
                <Typography
                    variant='h6'
                    color={grey['600']}
                    sx={{ marginBottom: '10px' }}
                >
                    {dictionary ? dictionary.reviews.noReviews : ''}
                </Typography>
            )}
        </>
    )
}

const Reviews = WithAuth(MyReviews)
export default Reviews
