'use client'

import {useState, useEffect} from 'react'
import { Convert, Shop } from '../model/Shop'

import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

import { Box, Typography, Button, LinearProgress } from '@mui/material';

export default function Map() {

    const [shops, setShops] = useState<Shop[]>([])

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
    },[])

    function openDetails(shop:Shop){
        setSelectedShop(shop)
        console.log(shop)
    }

    function closeDetails(){
        setSelectedShop(undefined)
    }

    const markerIcon:L.Icon = new L.Icon ({
        iconUrl: '/marker.png', 
        iconSize: [30, 30]
        });

    const [selectedShop, setSelectedShop] = useState<Shop | undefined>(undefined);
    const position:L.LatLngExpression = [47.497913, 19.040236]
    return (
        <Box bgcolor="secondary.main" sx={{ height: '100vh', width: '100vw', display: 'flex'}}>
        <Box bgcolor="secondary.main" sx={{ height: '100vh', width: '100vw', flex:{xs: selectedShop ? '0' : '2', sm: '2'}}}>
                <MapContainer center={position} zoom={8} scrollWheelZoom={true} style={{height:'100%', width:'100%'}}>
                    <TileLayer
                        attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                        url="https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=n0swbZslDTaWflzUvXMT"
                    />
                    {
                        shops.map((shop) => (
                            <Marker position={[shop.latitude, shop.longitude]}
                                    icon={markerIcon}
                                    key={`${shop.name}-${shop.amount}`}
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
            <Box sx={{ height: '100%', zIndex: '1000', flex:'1' }} >
                <Box style={{height:'100%', width:'100%', padding: '15% 15%'}}>
                    <Typography variant='h5' color='black'>Shop Info</Typography>
                    <Typography variant='subtitle1' color='black'>Requestor</Typography>
                    <Typography variant='subtitle2' color='black'>{selectedShop.name}</Typography>
                    <LinearProgress color='primary' variant='determinate' value={0}/>
                    <Button onClick={closeDetails}>
                        Close
                    </Button>
                    <Button onClick={closeDetails}>
                        Upload info
                    </Button>
                </Box>
            </Box>
        }
        </Box>
    );
}
