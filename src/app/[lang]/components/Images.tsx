'use client'

import {useState, useEffect} from 'react'

import { ImageList, ImageListItem, Box } from '@mui/material';
import FsLightbox from "fslightbox-react";

function srcset(image: string, size: number, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

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

export default function Images( props ) {
    const [imageData, setImageData] = useState<String[]>([])
    const [toggle, setToggle] =  useState<Boolean>(false);
	const [sIndex, setSIndex] =  useState(0);
	// Handler
	const  lightBoxHandler  = (state, sIndex) => {
		setToggle(state);
		setSIndex(sIndex);
	};

    useEffect(() => {
        async function getImages() {
            try{
                if (props.shopId) {
                    const res = await fetch(`../../api/images/shop/${props.shopId}`, {
                        method: 'GET'
                    });

                    const data = await res.json();
                    let imageURLs: String[] = []
                    data.data.map((item) => {imageURLs.push(`../../api/images/${item}`)})
                    setImageData(imageURLs)
                }
                else if (props.reviewId) {
                    const res = await fetch(`../../api/images/review/${props.reviewId}`, {
                        method: 'GET'
                    });

                    const data = await res.json();
                    let imageURLs: String[] = []
                    data.data.map((item) => {imageURLs.push(`../../api/images/${item}`)})
                    setImageData(imageURLs)
                }
            } catch (e) {
                console.log("Handle error", e)
            }
        }

        getImages()
    },[])

    return (
        <>
            {/* Images */}
            <ImageList
                sx={{ width: 1, height: 1/2, marginBottom: '20px' }}
                variant="quilted"
                cols={4}
                rowHeight={121}
            >

                {imageData && imageData.map((item, index) => {
                    const pos = imagePosition[ index % imagePosition.length ];

                    return (
                        <ImageListItem key={item} cols={pos.cols || 1} rows={pos.rows || 1}>
                        <img
                            src={item}
                            alt={item}
                            loading="lazy"
                        />
                        </ImageListItem>
                    )
                })}

                { !imageData.length && 
                    <ImageListItem key={"../../nopic.jpeg"} cols={4} rows={2}>
                        <img
                            {...srcset("../../nopic.jpeg", 100)}
                            alt={"undifined"}
                            loading="lazy"
                        />
                    </ImageListItem>
                }

            </ImageList>

            <Box>
            <FsLightbox
                    toggler={toggle}
                    sources={imageData}
                    type="image"
                />
            </Box> 
                    
        </>
    );
}
