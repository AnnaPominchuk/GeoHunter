'use client'

import {withAuthAdmin} from '../../components/withAuth';
import Images from '../../components/Images'

import { 
    Box,
    Typography,
    Stack,
    IconButton,
    Input,
    Button,
    Checkbox,
    FormControlLabel
} from '@mui/material';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import { Unstable_Popup as Popup } from '@mui/base/Unstable_Popup';

import { useState, useEffect, useRef } from 'react';
import {useRouter} from 'next/navigation'

import { Convert, Review, ReviewStatus, ReviewStatusConvert } from '../../../../model/Review'

import { getDictionary } from '@/lib/dictionary'
import { Locale } from '../../../../../i18n.config'

import { grey } from '@mui/material/colors'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import { styled, css } from '@mui/system';

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
  `,
);

const myPage = ({
    params : { lang, reviewId }
  }: {
    params: { lang: Locale, reviewId: String}
  }) => {

    const [ dictionary, setDictionary ] = useState<any>()
    useEffect(() => {
      const setDict = async() => {
        const dict = await getDictionary(lang)
        setDictionary(dict)
      }
  
      setDict()
    }, [])

    const router = useRouter()

    const [review, setReview] = useState<Review|null>(null)
    const [openDialog, setOpen] = useState(false);
    const [hintAnchor, setAnchor] = useState<null | SVGSVGElement>(null);
    const [rate, setRate] = useState(0);
    const [saveAddress, setSaveAddress] = useState<Boolean>(true);
    const openHint = Boolean(hintAnchor);

    async function getReview() {
            try {
                const res = await fetch(`../../api/review/${reviewId || ''}`, {
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
        const res = await fetch(`../../api/review/${id || ''}`, {
                        method: 'PATCH',
                        body: JSON.stringify({
                            status: ReviewStatus.Approved, 
                            rating: rate || 0, 
                            options: {saveAddress: saveAddress} 
                        })
                    }).then( () => getReview() );

        setOpen(false);
    }

    const handleReject = async (id: String) => {
        const res = await fetch(`../../api/review/${id || ''}`, {
                        method: 'PATCH',
                        body: JSON.stringify({status: ReviewStatus.Rejected})
                    }).then( () => getReview() );
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        if (e.target.value > 10) e.target.value = 10
        if (e.target.value < 1) e.target.value = 1

        setRate(e.target.value)
    }

    const handleChangCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSaveAddress(event.target.checked)
    };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-around',  flexDirection: {xs:'column', sm:'column', md:'row'}}} bgcolor="secondary.main">
       
        <Box sx={{ marginTop: "10px", marginX: {xs:"50px", sm:"50px", md:0}, width:2/3 }} bgcolor="secondary.main">
            <Stack 
                direction= "row"
                justifyContent='space-between'
                sx={{marginBottom: '10px'}}
            >
                <IconButton 
                    aria-label="back"
                    onClick={() => router.back()}
                    sx={{marginLeft: "-50px"}} // TO DO: styles
                 >
                    <ArrowBackIcon />
                </IconButton>

                {/* <Typography variant='h6' color={grey['800']}> { dictionary ? dictionary.reviews.reviewDetails : ''  </Typography> */}
            </Stack>

            { review && <>
                <Stack direction="column">
                    <Typography variant='h6' color={grey['800']} sx={{marginBottom: "2px"}} >{review?.name}</Typography>

                    <Typography color={ReviewStatusConvert.toColor(review?.status, true)}>
                        {ReviewStatusConvert.toText(review?.status)}
                    </Typography>

                    { review?.rating > 0 && <Typography color='primary'  sx={{margintop: "2px"}}>
                            {`Points ${review?.rating}`} 
                        </Typography>
                    }

                <Typography color={grey['700']} sx={{marginTop: "20px"}} >{review?.address}</Typography>
                <Typography sx={{marginTop: "5px"}} >{review?.review}</Typography>
                </Stack>   

                <Stack alignItems={'center'} sx={{marginTop: "50px", maxHeight: "350px", overflow: 'auto'}}>
                    <Stack sx={{ maxWidth:2/3}}>
                        <Images reviewId={review?._id} />
                    </Stack>
                </Stack>        

                <Stack direction="row" spacing={2} sx={{marginTop: '30px', marginBottom: '30px'}} justifyContent={'flex-end'} >
                    { review.status != 'Rejected' && <Button size='small' aria-label="fingerprint" color="primary"  startIcon={<BlockIcon />}
                            onClick={() => handleReject(review?._id)}
                            variant="outlined"
                        >
                            { dictionary ? dictionary.reviews.rejectButton : '' }
                        </Button>
                    }
                    { review.status != 'Approved' && <Button size='small' variant="contained" aria-label="fingerprint" color="primary" startIcon={<CheckCircleIcon />}
                            onClick={e => handleClickOpen(e)}
                        >
                            { dictionary ? dictionary.reviews.approveButton : '' }
                        </Button>
                    }

                </Stack>

                <Dialog 
                    open={openDialog} 
                    onClose={handleClose}
                >
                    <DialogContent sx={{padding:"30px"}}>
                        <DialogContentText>
                            <span>{ dictionary ? dictionary.reviews.rateReview : '' }</span>
                            <HelpOutlineIcon 
                                onMouseEnter={e => setAnchor(e.currentTarget)}
                                onMouseLeave={() => setAnchor(null)}
                                fontSize='small'
                            />
                        </DialogContentText>

                        <Input
                            sx={{marginTop:"30px"}}
                            id="rating"
                            autoFocus
                            fullWidth
                            type='number'
                            placeholder="Enter rating"
                            onChange={handleChange}
                            defaultValue={1}
                            inputProps={{ min:1, max:10 }}
                        />
                        <Popup id='hint' open={openHint} anchor={hintAnchor}>
                            <StyledPopperDiv>{ dictionary ? dictionary.reviews.hint : '' }</StyledPopperDiv>
                        </Popup>

                    { review.address && <FormControlLabel 
                        control={<Checkbox checked={saveAddress} onChange={handleChangCheckbox}/>}
                        label={<Typography color={grey['700']}>{dictionary ? dictionary.reviews.saveAddress : ''}</Typography> }
                        sx={{marginTop:"20px"}}
                    /> }

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>
                            { dictionary ? dictionary.reviews.cancelButton : '' }
                        </Button>
                        <Button onClick={() => handleApprove(review?._id)} variant="contained">
                            { dictionary ? dictionary.reviews.approveButton : '' }
                        </Button>
                    </DialogActions>
                </Dialog>
            </>}
            
        </Box>
    </Box>
  )
}
const Page = withAuthAdmin(myPage);
export default Page;