'use client'

import {useState, useEffect} from 'react'
import { Convert, Shop } from '../model/Shop'

import { 
    Map, GoogleApiWrapper, Marker, InfoWindow
 } from "google-maps-react";

import { styled } from '@mui/material/styles';
import { Button, Box, Typography } from '@mui/material';

const mapStyles = {
    width: '70%',
    height: '70%',
    marginTop: '5%',
    marginLeft: '15%',
};

const GoogleMap = () => {

    const [shops, setShops] = useState<Shop[]>([])

    useEffect(() => {
        async function getShops() {
            const res = await fetch('/api/shop', {
                method: 'GET'
                });
            const data = await res.json();

            try {
                let shopsList:Shop[] = []
                for(let shopData of data.shops.shops) {
                    let shop:Shop = Convert.toShop(JSON.stringify(shopData))
                    shopsList.push(shop)
                    //TO DO check loaded to db data
                    break;
                }
                setShops(shopsList)
            } catch (e) {
                console.log("Handle error", e)
            }   
        }

        getShops()
    },[])

    const [selectedShop, setSelectedShop] = useState<Shop | undefined>(undefined);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} bgcolor="secondary.main">
          <Map
            google={window.google}
            zoom={10}
            style={mapStyles}
            initialCenter={
                {
                    lat: 19.020145856138136, 
                    lng: -98.24006775697993
                }
            }
        >
            {
                shops?.map( (shop: Shop) =>
                    (
                        <Marker
                            position={
                                {
                                    lat: shop.latitude, 
                                    lng: shop.longtitude
                                }
                            }
                            onClick={ () => {
                                shop === selectedShop ?
                                      setSelectedShop(undefined)
                                    : setSelectedShop(shop);
                              }
                            }
                            key={`${shop.name} - ${shop.adress}`}
                        /> 
                    )
                )
            }
            {
                selectedShop && (
                    <InfoWindow
                        position={{
                            lat: selectedShop.latitude,
                            lng: selectedShop.longtitude,
                        }}
                        zIndex={10}
                        onClick={() => setSelectedShop(undefined)}
                        options={{
                            pixelOffset: {
                                width: 0,
                                height: -40,
                            }
                        }}
                    >
                        <div> {selectedShop.name} </div>
                        {/* <Typography zIndex={10}> {selectedShop.name} </Typography> */}
                    </InfoWindow>
                )
            }
        </Map>
        </Box>
    );
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyBNxj5FFnm0zVSZ7-tUfXoAAB0GIL8TwKM"
})(GoogleMap);
