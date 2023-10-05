'use client'

import {useState, useEffect, useRef} from 'react'
import { Convert, Shop } from '../model/Shop'

import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

import { Box, Typography, Button, ButtonGroup, LinearProgress, ImageList, ImageListItem } from '@mui/material';
import { useRouter } from 'next/navigation'

import { styled } from '@mui/material/styles';
import theme from '@/utils/Theme'

import { grey } from '@mui/material/colors'

function srcset(image: string, size: number, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

const StyledButtonGroup = styled(ButtonGroup)({
  "& .MuiButtonGroup-grouped:not(:last-of-type)": {
    borderColor: "white"
  }
});

const imagePosition = [
    {
        rows: 2,
        cols: 2,
    },
    {
        rows: 1,
        cols: 1,
    },
    {
        rows: 1,
        cols: 1,
    },
    {
        rows: 1,
        cols: 2,
    },
    {
        rows: 2,
        cols: 2,
    },
    {
        rows: 1,
        cols: 1,
    },
    {
        rows: 1,
        cols: 1,
    },
]

export default function Map() {

    const router = useRouter()
    const [shops, setShops] = useState<Shop[]>([])
    const [imageData, setImageData] = useState([])
    const [selectedShop, setSelectedShop] = useState<Shop | undefined>(undefined);

    const mapRef = useRef(null);

    useEffect(() => {
        async function getShops() {
            try {
                const res = await fetch('/api/shop', {
                    method: 'GET'
                    });
                const data = await res.json();

                let shopsList:Shop[] = []
                for(let shopData of data.shops.shops) {
                    let shop:Shop = Convert.toShop(JSON.stringify(shopData))
                    shopsList.push(shop)
                }
                setShops(shopsList)
            } catch (e) {
                console.log("Handle error", e)
            }   
        }

        async function getImages() {
            try{
                if (!selectedShop)
                    return setImageData([])

                const res = await fetch(`/api/images/shop/${selectedShop?._id}`, {
                    method: 'GET'
                });

                const data = await res.json();
                if (data.data) setImageData(data.data)
            } catch (e) {
                console.log("Handle error", e)
            }
        }

        getShops()
        getImages()

    },[selectedShop])

    function openDetails(shop:Shop){
        setSelectedShop(shop)
        mapRef.current.closePopup();
    }

    function closeDetails(){
        setSelectedShop(undefined)
    }

    const markerIcon:L.Icon = new L.Icon ({
        iconUrl: '/marker.png', 
        iconSize: [30, 30]
        });

    const position:L.LatLngExpression = [47.497913, 19.040236]
    return (
        // TO DO: sizing
        <Box bgcolor="secondary.main" sx={{ height: "92vh", display: 'flex'}}> 
        <Box bgcolor="secondary.main" sx={{ flex:{xs: selectedShop ? '0' : '2', sm: '2'}}}>
                <MapContainer center={position} zoom={8} scrollWheelZoom={true} style={{height:'100%', width:'100%'}} ref={mapRef}>
                    <TileLayer
                        attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                        url="https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=n0swbZslDTaWflzUvXMT"
                    />
                    {
                        shops.map((shop, index) => (
                            <Marker position={[shop.latitude, shop.longitude]}
                                    icon={markerIcon}
                                    key={`${shop.name}-${shop.amount}-${index}`}
                                    >
                                <Popup>
                                    <Box>
                                        <Box sx={{padding: '10px'}}>
                                            <Typography variant='subtitle1'>Requestor</Typography>
                                            <Typography variant='caption'>{shop.name}</Typography>
                                        </Box>
                                        <Box>
                                            <Button onClick={() => openDetails(shop)}>
                                                Open details
                                            </Button>
                                        </Box>
                                    </Box>  
                                </Popup>
                            </Marker>
                        ))
                    }
                </MapContainer>
        </Box>
        {
            selectedShop &&
            <Box sx={{ height: '100%', zIndex: '1000', flex:'1', boxShadow: 10, display:"flex", overflowY: "scroll"}} >
                <Box style={{height:'100%', width:'100%', padding: '15% 15%'}}>

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
                                    src={`api/images/${item}`}
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
                    
                    {/* Text */}
                    <Typography variant='h5' color={grey['800']}>{selectedShop.name}</Typography>
                    <Typography variant='subtitle1' color={grey['700']} sx={{ marginBottom: '10px' }}>
                        Requestor
                    </Typography>
                    <Typography variant='subtitle2'color={grey['700']} sx={{ marginBottom: '30px' }}>
                        {selectedShop.name}
                    </Typography>

                    <Typography 
                        variant='subtitle1' 
                        color={theme.palette.primary.main} 
                        sx={{ marginBottom: '8px' }}
                    >
                        Progress Bar
                    </Typography>
                    <LinearProgress 
                      color='primary' variant='determinate' value={70} 
                       sx={{ marginBottom: '20px' }}
                     />
                    
                    <StyledButtonGroup
                        sx={{ marginBottom:5 }}
                        variant="text"
                    >
                        <Button onClick={closeDetails}>
                            Close
                        </Button>
                        <Button onClick={() => router.push(`/form/${selectedShop._id}`)}>
                            Upload info
                        </Button>
                    </StyledButtonGroup>
                </Box>
            </Box>
        }
        </Box>
    );
}
