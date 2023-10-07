'use client'

import {useState, useEffect, useRef} from 'react'
import { Convert, Shop } from '../model/Shop'

import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

import Images from '../components/Images'

import { Box, Typography, Button, ButtonGroup, LinearProgress } from '@mui/material';
import { useRouter } from 'next/navigation'

import { styled } from '@mui/material/styles';
import theme from '@/utils/Theme'

import { grey } from '@mui/material/colors'

const StyledButtonGroup = styled(ButtonGroup)({
  "& .MuiButtonGroup-grouped:not(:last-of-type)": {
    borderColor: "white"
  }
});

export default function Map() {

    const router = useRouter()
    const [shops, setShops] = useState<Shop[]>([])
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
        getShops()

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
                    <Images shopId={selectedShop._id} />
                    
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
