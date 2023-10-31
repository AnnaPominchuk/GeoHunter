'use client'

import { useState, useEffect } from 'react'

import { ImageList, ImageListItem, Box } from '@mui/material'
import FsLightbox from 'fslightbox-react'

const imagePosition = [
    {
        rows: 2,
        cols: 4,
    },
    {
        rows: 2,
        cols: 2,
    },
    {
        rows: 2,
        cols: 2,
    },
]

export default function Images(props: {
    shopId: string | undefined | null
    reviewId: string | undefined | null
}) {
    const [imageData, setImageData] = useState<string[]>([])
    const [toggle, setToggle] = useState<boolean>(false)

    useEffect(() => {
        async function getImages() {
            try {
                if (props.shopId) {
                    const res = await fetch(
                        `../../api/images/shop/${props.shopId}`,
                        {
                            method: 'GET',
                        }
                    )

                    const data = await res.json()
                    const imageURLs: string[] = []
                    data.data.map((item: string) => {
                        imageURLs.push(`../../api/images/${item}`)
                    })
                    setImageData(imageURLs)
                } else if (props.reviewId) {
                    const res = await fetch(
                        `../../api/images/review/${props.reviewId}`,
                        {
                            method: 'GET',
                        }
                    )

                    const data = await res.json()
                    const imageURLs: string[] = []
                    data.data.map((item: string) => {
                        imageURLs.push(`../../api/images/${item}`)
                    })
                    setImageData(imageURLs)
                }
            } catch (e) {
                console.error('Handle error', e)
            }
        }

        getImages()
    }, [props.reviewId, props.shopId])

    return (
        <>
            {/* Images */}
            <ImageList
                sx={{ width: 1, height: 350, marginBottom: '20px' }}
                variant='quilted'
                cols={4}
                rowHeight={121}
            >
                {imageData &&
                    imageData.map((item, index) => {
                        const pos = imagePosition[index % imagePosition.length]

                        return (
                            <ImageListItem
                                key={item}
                                cols={pos.cols || 1}
                                rows={pos.rows || 1}
                            >
                                <img
                                    src={item}
                                    alt={item}
                                    loading='lazy'
                                    onClick={() => setToggle(!toggle)}
                                />
                            </ImageListItem>
                        )
                    })}

                {!imageData.length && (
                    <ImageListItem
                        key={'../../images/nopic.jpeg'}
                        cols={4}
                        rows={2.8}
                    >
                        <img
                            src='../../images/nopic.jpeg'
                            alt={'undifined'}
                            loading='lazy'
                        />
                    </ImageListItem>
                )}
            </ImageList>

            <Box sx={{ position: 'fixed', zIndex: '1001' }}>
                <FsLightbox toggler={toggle} sources={imageData} type='image' />
            </Box>
        </>
    )
}
