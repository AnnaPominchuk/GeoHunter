'use client'

import { WithAuthAdmin } from '@/components/withAuth'

import {
    Box,
    Typography,
    Stack,
    IconButton,
    Menu,
    FormControlLabel,
    FormGroup,
    Checkbox,
    Button,
} from '@mui/material'

import { useState, useEffect } from 'react'

import Reviews from '@/components/Reviews'

import { ReviewStatus } from '@/model/Review'

import { grey } from '@mui/material/colors'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { getDictionary, Dictionary, ConvertDictionary } from '@/lib/dictionary'
import { Locale } from '@/config/i18n.config'

const ReviewsPage = ({ params: { lang } }: { params: { lang: Locale } }) => {
    const [dictionary, setDictionary] = useState<Dictionary>()
    useEffect(() => {
        const setDict = async () => {
            const dict = await getDictionary(lang)
            setDictionary(ConvertDictionary.toDictionary(JSON.stringify(dict)))
        }

        setDict()
    }, [lang])

    const [filter, setFilter] = useState<string[]>(['InReview'])
    const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null)
    const filterOpen = Boolean(filterAnchor)

    const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setFilterAnchor(event.currentTarget)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) setFilter([...filter, ...[event.target.name]])
        else setFilter([...filter.filter((item) => item != event.target.name)])
    }

    return (
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
                    marginTop: '50px',
                    marginBottom: '30px',
                    marginX: { xs: '50px', sm: '50px', md: 0 },
                    minWidth: 1 / 2,
                    maxWidth: 2 / 3,
                }}
                bgcolor='secondary.main'
            >
                <Stack
                    direction='row'
                    justifyContent='space-between'
                    sx={{ marginBottom: '10px' }}
                >
                    <Typography variant='h5' color={grey['800']}>  
                        {dictionary
                            ? dictionary.reviews.reviewsCaption
                            : ''}
                    </Typography>
                    <IconButton aria-label='filter' onClick={handleFilterClick}>
                        <FilterAltIcon />
                    </IconButton>
                </Stack>

                <Menu
                    id='mobile-menu'
                    anchorEl={filterAnchor}
                    open={filterOpen}
                    onClose={() => setFilterAnchor(null)}
                >
                    <FormGroup sx={{ padding: '8px' }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={filter.includes(
                                        ReviewStatus.InReview
                                    )}
                                    name={ReviewStatus.InReview}
                                    onChange={handleChange}
                                    size='small'
                                />
                            }
                            label={
                                dictionary ? dictionary.reviews.inReview : ''
                            }
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={filter.includes(
                                        ReviewStatus.Approved
                                    )}
                                    name={ReviewStatus.Approved}
                                    onChange={handleChange}
                                    size='small'
                                />
                            }
                            label={
                                dictionary ? dictionary.reviews.approved : ''
                            }
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={filter.includes(
                                        ReviewStatus.Rejected
                                    )}
                                    name={ReviewStatus.Rejected}
                                    onChange={handleChange}
                                    size='small'
                                />
                            }
                            label={
                                dictionary ? dictionary.reviews.rejected : ''
                            }
                        />
                    </FormGroup>
                    <Button onClick={() => setFilterAnchor(null)}>
                        {dictionary ? dictionary.reviews.applyButton : ''}
                    </Button>
                </Menu>

                <Reviews params={{ lang, filter, userId: '' }} />
            </Box>
        </Box>
    )
}
const Page = WithAuthAdmin(ReviewsPage)
export default Page
