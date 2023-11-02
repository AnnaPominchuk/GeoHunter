'use client'

import { WithAuth } from '@/components/withAuth'
import Images from '@/components/Images'

import {
    Box,
    Typography,
    Stack,
    IconButton,
    Input,
    Button,
    Checkbox,
    FormControlLabel,
    Alert,
} from '@mui/material'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'

import { Unstable_Popup as Popup } from '@mui/base/Unstable_Popup'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import {
    Convert,
    Review,
    ReviewStatus,
    ReviewStatusConvert,
} from '@/model/Review'

import { User, Convert as UserConvert } from '@/model/User'
import UserRole from '@/utils/UserRole'

import { getDictionary, Dictionary, ConvertDictionary } from '@/lib/dictionary'
import { Locale } from '@/config/i18n.config'

import { grey } from '@mui/material/colors'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import BlockIcon from '@mui/icons-material/Block'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

import { styled, css } from '@mui/system'

const StyledPopperDiv = styled('div')(
    ({ theme }) => css`
        background-color: ${grey[50]};
        border-radius: 8px;
        border: 1px solid ${grey[200]};
        box-shadow: ${theme.palette.mode === 'dark'
            ? `0px 4px 8px rgb(0 0 0 / 0.7)`
            : `0px 4px 8px rgb(0 0 0 / 0.1)`};
        padding: 0.75rem;
        color: ${grey[700]};
        font-size: 0.875rem;
        font-family: 'IBM Plex Sans', sans-serif;
        font-weight: 500;
        opacity: 1;
        margin: 0.25rem 0;
    `
)

const ReviewPage = ({
    params: { lang, reviewId },
}: {
    params: { lang: Locale; reviewId: string }
}) => {
    const [dictionary, setDictionary] = useState<Dictionary>()
    useEffect(() => {
        const setDict = async () => {
            const dict = await getDictionary(lang)
            setDictionary(ConvertDictionary.toDictionary(JSON.stringify(dict)))
        }

        setDict()
    }, [lang])

    const router = useRouter()

    const { data: session } = useSession()
    const [review, setReview] = useState<Review | null>(null)
    const [errorMsg, setErrorMsg] = useState<string>('')
    const [openDialog, setOpen] = useState(false)
    const [hintAnchor, setAnchor] = useState<null | SVGSVGElement>(null)
    const [rate, setRate] = useState(1)
    const [saveAddress, setSaveAddress] = useState<boolean>(true)
    const openHint = Boolean(hintAnchor)
    const [isAdmin, setIsAdmin] = useState<boolean>(false)
    const [author, setAuthor] = useState<User | null>(null)

    async function getReview() {
        try {
            const res = await fetch(`../../api/review/${reviewId || ''}`, {
                method: 'GET',
            })
            const data = await res.json()

            if (data.status == 200) {
                const r: Review = Convert.toReview(JSON.stringify(data.review))
                setReview(r)
            } else {
                setErrorMsg(data.review.error)
            }
        } catch (e) {
            console.error('Handle error', e)
        }
    }

    useEffect(() => {
        setIsAdmin(session?.user?.roles?.includes(UserRole.ADMIN) ?? false)
        getReview()
    }, [session?.user?.roles])

    const handleApprove = async (id: string) => {
        await fetch(`../../api/review/${id || ''}`, {
            method: 'PATCH',
            body: JSON.stringify({
                status: ReviewStatus.Approved,
                rating: rate || 0,
                options: { saveAddress: saveAddress },
            }),
        }).then(() => getReview())

        setOpen(false)
    }

    async function getUser() {
        try {
            if (!review) return

            const resUser = await fetch(
                `../../api/user/${review.userId || ''}`,
                {
                    method: 'GET',
                }
            )

            const users = await resUser.json()

            const user: User = UserConvert.toUser(
                JSON.stringify(users.data.users)
            )

            if (users.status == 200) setAuthor(user)
        } catch (e) {
            console.error('Handle error', e)
        }
    }

    useEffect(() => {
        getUser()
    }, [review])

    const handleReject = async (id: string) => {
        await fetch(`../../api/review/${id || ''}`, {
            method: 'PATCH',
            body: JSON.stringify({ status: ReviewStatus.Rejected }),
        }).then(() => getReview())
    }

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let valNumber = parseInt(e.target.value)
        if (valNumber > 10) valNumber = 10
        if (valNumber < 1) valNumber = 1

        setRate(valNumber)
    }

    const handleChangCheckbox = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSaveAddress(event.target.checked)
    }

    const handleBlockAuthor = async (blocked: boolean) => {
        await fetch(`../../api/user/block/${review?.userId || ''}`, {
            method: 'PATCH',
            body: JSON.stringify({ blocked: blocked }),
        }).then(() => getUser())
    }

    return errorMsg ? (
        <Alert severity='error'>{errorMsg}</Alert>
    ) : (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-around',
                flexDirection: { xs: 'column', sm: 'column', md: 'row' },
            }}
            bgcolor='secondary.main'
        >
            <Box
                sx={{
                    marginTop: '10px',
                    marginX: { xs: '50px', sm: '50px', md: 0 },
                    width: 2 / 3,
                }}
                bgcolor='secondary.main'
            >
                <Stack
                    direction='row'
                    justifyContent='space-between'
                    sx={{ marginBottom: '10px' }}
                >
                    <IconButton
                        aria-label='back'
                        onClick={() => router.back()}
                        sx={{ marginLeft: '-50px' }} // TO DO: styles
                    >
                        <ArrowBackIcon />
                    </IconButton>
                </Stack>

                {review && (
                    <>
                        <Stack direction='column'>
                            <Typography
                                variant='h6'
                                color={grey['800']}
                                sx={{
                                    marginBottom: '2px',
                                    wordWrap: 'break-word',
                                }}
                            >
                                {review?.name}
                            </Typography>

                            <Typography
                                color={ReviewStatusConvert.toColorText(
                                    review?.status
                                )}
                            >
                                {ReviewStatusConvert.toText(review?.status)}
                            </Typography>

                            {review?.rating > 0 && (
                                <Typography
                                    color='primary'
                                    sx={{ margintop: '2px' }}
                                >
                                    {`Points ${review?.rating}`}
                                </Typography>
                            )}

                            <Stack direction='row'>
                                <PriorityHighIcon
                                    color='error'
                                    sx={{ marginTop: '20px' }}
                                />
                                <Typography
                                    color={grey['700']}
                                    sx={{ marginTop: '20px' }}
                                >
                                    {dictionary
                                        ? review.hasSupportBoard == true
                                            ? dictionary.reviews
                                                  .supportBoardPresentText
                                            : dictionary.reviews
                                                  .noSupportBoardText
                                        : ''}
                                </Typography>
                            </Stack>

                            <Typography
                                color={grey['700']}
                                sx={{ marginTop: '20px' }}
                            >
                                {review?.address}
                            </Typography>
                            <Typography
                                sx={{
                                    marginTop: '5px',
                                    wordWrap: 'break-word',
                                }}
                            >
                                {review?.review}
                            </Typography>
                        </Stack>

                        <Stack
                            alignItems={'center'}
                            sx={{
                                marginTop: '50px',
                                maxHeight: '350px',
                                overflow: 'auto',
                            }}
                        >
                            <Stack sx={{ width: 2 / 3 }}>
                                <Images reviewId={review?._id} shopId={null} />
                            </Stack>
                        </Stack>

                        {isAdmin && (
                            <Stack
                                direction='row'
                                sx={{
                                    marginTop: '30px',
                                    marginBottom: '30px',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Stack>
                                    {author?.blocked ? (
                                        <Button
                                            size='small'
                                            component='label'
                                            variant='text'
                                            aria-label='fingerprint'
                                            color='error'
                                            onClick={() =>
                                                handleBlockAuthor(false)
                                            }
                                        >
                                            {dictionary
                                                ? dictionary.reviews
                                                      .unblockAuthor
                                                : ''}
                                        </Button>
                                    ) : (
                                        <Button
                                            size='small'
                                            component='label'
                                            variant='text'
                                            aria-label='fingerprint'
                                            color='error'
                                            onClick={() =>
                                                handleBlockAuthor(true)
                                            }
                                        >
                                            {dictionary
                                                ? dictionary.reviews.blockAuthor
                                                : ''}
                                        </Button>
                                    )}
                                </Stack>

                                <Stack
                                    direction='row'
                                    spacing={2}
                                    sx={{ justifyContent: 'flex-end' }}
                                >
                                    {review.status != 'Rejected' && (
                                        <Button
                                            size='small'
                                            aria-label='fingerprint'
                                            color='primary'
                                            startIcon={<BlockIcon />}
                                            onClick={() =>
                                                handleReject(review?._id)
                                            }
                                            variant='outlined'
                                        >
                                            {dictionary
                                                ? dictionary.reviews
                                                      .rejectButton
                                                : ''}
                                        </Button>
                                    )}
                                    {review.status != 'Approved' && (
                                        <Button
                                            size='small'
                                            component='label'
                                            variant='contained'
                                            aria-label='fingerprint'
                                            color='primary'
                                            startIcon={<CheckCircleIcon />}
                                            onClick={handleClickOpen}
                                        >
                                            {dictionary
                                                ? dictionary.reviews
                                                      .approveButton
                                                : ''}
                                        </Button>
                                    )}
                                </Stack>
                            </Stack>
                        )}

                        <Dialog open={openDialog} onClose={handleClose}>
                            <DialogContent sx={{ padding: '30px' }}>
                                <DialogContentText>
                                    <span>
                                        {dictionary
                                            ? dictionary.reviews.rateReview
                                            : ''}
                                    </span>
                                    <HelpOutlineIcon
                                        onMouseEnter={(e) =>
                                            setAnchor(e.currentTarget)
                                        }
                                        onMouseLeave={() => setAnchor(null)}
                                        fontSize='small'
                                    />
                                </DialogContentText>

                                <Input
                                    sx={{ marginTop: '30px' }}
                                    id='rating'
                                    autoFocus
                                    fullWidth
                                    type='number'
                                    placeholder='Enter rating'
                                    onChange={handleChange}
                                    defaultValue={1}
                                    value={rate}
                                    inputProps={{ min: 1, max: 10 }}
                                />
                                <Popup
                                    id='hint'
                                    open={openHint}
                                    anchor={hintAnchor}
                                >
                                    <StyledPopperDiv>
                                        {dictionary
                                            ? dictionary.reviews.hint
                                            : ''}
                                    </StyledPopperDiv>
                                </Popup>

                                {review.address && (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={saveAddress}
                                                onChange={handleChangCheckbox}
                                            />
                                        }
                                        label={
                                            <Typography color={grey['700']}>
                                                {dictionary
                                                    ? dictionary.reviews
                                                          .saveAddress
                                                    : ''}
                                            </Typography>
                                        }
                                        sx={{ marginTop: '20px' }}
                                    />
                                )}
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>
                                    {dictionary
                                        ? dictionary.reviews.cancelButton
                                        : ''}
                                </Button>
                                <Button
                                    onClick={() => handleApprove(review?._id)}
                                    variant='contained'
                                    component='label'
                                >
                                    {dictionary
                                        ? dictionary.reviews.approveButton
                                        : ''}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </>
                )}
            </Box>
        </Box>
    )
}
const Page = WithAuth(ReviewPage)
export default Page
