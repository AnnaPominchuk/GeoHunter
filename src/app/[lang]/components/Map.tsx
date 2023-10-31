'use client'

import { useState, useEffect, useRef, ReactElement } from 'react'
import { Convert, Shop } from '@/model/Shop'

import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

import Images from './Images'

import { Box, Typography, Button, ButtonGroup, List, ListItem, ListItemText, Divider } from '@mui/material'
import { useRouter } from 'next/navigation'
import { Props } from '@/utils/Props'
import { getDictionary, Dictionary, ConvertDictionary } from '@/lib/dictionary'

import { useSession } from 'next-auth/react'

import UserRole from '@/utils/UserRole'

import { styled } from '@mui/material/styles'
import { grey } from '@mui/material/colors'
import React from 'react'

import config from '@/config/appconfig.json'

const StyledButtonGroup = styled(ButtonGroup)({
    '& .MuiButtonGroup-grouped': {
        borderColor: 'white',
    },
})

const StyledListItem = styled(ListItem)({
  '&.MuiListItem-root:hover': {
      cursor: "pointer",
      background : grey[100],
  }
})

type Coord = {
    lat: number,
    lon: number
}

type MarkerProps = {
    position: string,
    icon: string,
    key: string
}

type Address2Shops = Map<string, Shop[]>
type pageElementType = ReactElement<MarkerProps, typeof Marker>

export default function MapLayout({ params }: Props) {
    const [dictionary, setDictionary] = useState<Dictionary>()
    useEffect(() => {
        const setDict = async () => {
            const dict = await getDictionary(params.lang)
            setDictionary(ConvertDictionary.toDictionary(JSON.stringify(dict)))
        }

        setDict()
    }, [params.lang])

    const router = useRouter()
    const [shops, setShops] = useState<Address2Shops>(new Map())
    const [pageElements, setPageElement] = useState<pageElementType[]>([])
    const [selectedShop, setSelectedShop] = useState<Shop | undefined>(
        undefined
    )
    const [selectedList, setSelectedList] = useState<Shop[] | undefined>(
        undefined
    )
    const { data: session } = useSession()

    const mapRef = useRef<L.Map>(null)

    useEffect(() => {
        async function getShops() {
            try {
                const res = await fetch('../api/shop', {
                    method: 'GET',
                })
                const data = await res.json()

                const shopsList: Address2Shops = new Map()
                for (const shopData of data.shops.shops) {
                    const shop: Shop = Convert.toShop(JSON.stringify(shopData))
                    const coord: Coord = {lat: shop.latitude, lon: shop.longitude}

                    const shopsArray = shopsList.get(JSON.stringify(coord))
                    if (shopsArray) shopsArray.push(shop)
                    else shopsList.set(JSON.stringify(coord), [shop])
                }
                setShops(shopsList)
            } catch (e) {
                console.error('Handle error', e)
            }
        }
        getShops()
    }, [selectedShop])

    const shopsToPageElement = (shopsMap: Address2Shops) => {
        const elements: pageElementType[] = []
        let index: number = 0
        for (const address2Shops of shopsMap)
        {
            const coord = JSON.parse(address2Shops[0])
            const shopsList = address2Shops[1]
            if (shopsList.length > 1) {
                const shop = shopsList[0]
                elements.push(
                    <Marker
                        position={[coord.lat, coord.lon]}
                        icon={markerIcon}
                        key={`${index++}`}
                    >
                        <Popup>
                            <Box>
                                {shop.address && (
                                    <Box sx={{ padding: '10px' }}>
                                        <Typography variant='subtitle1'>
                                            {shop.address}
                                        </Typography>
                                        <Typography variant='caption'>
                                            {dictionary ? dictionary.map.shopsCount : '' }
                                            {": "}
                                             {shopsList.length}
                                        </Typography>
                                    </Box>
                                )}
                                <Box>
                                    <Button
                                        onClick={() => openList(shopsList)}
                                    >
                                        {dictionary
                                            ? dictionary.navigation
                                                    .detailsButton
                                            : ''}
                                    </Button>
                                </Box>
                            </Box>
                        </Popup>
                    </Marker>       
                )
            }
            else {
                const shop = shopsList[0]
                elements.push(
                     <Marker
                            position={[coord.lat, coord.lon]}
                            icon={markerIcon}
                            key={`${shop.name}-${shop.amount}-${index++}`}
                        >
                            <Popup>
                                <Box>
                                    {!shop.name && (
                                        <Box sx={{ padding: '10px' }}>
                                            <Typography variant='subtitle1'>
                                                {dictionary
                                                    ? dictionary.map.requestor
                                                    : ''}
                                            </Typography>
                                            <Typography variant='caption'>
                                                {shop.requestor}
                                            </Typography>
                                        </Box>
                                    )}
                                    {shop.name && (
                                        <Box sx={{ padding: '10px' }}>
                                            <Typography variant='subtitle1'>
                                                {shop.name}
                                            </Typography>
                                        </Box>
                                    )}
                                    <Box>
                                        <Button
                                            onClick={() => openDetails(shop)}
                                        >
                                            {dictionary
                                                ? dictionary.navigation
                                                      .detailsButton
                                                : ''}
                                        </Button>
                                    </Box>
                                </Box>
                            </Popup>
                        </Marker>                
                )
            }
        }
        setPageElement(elements)
    }

    useEffect(() => {
        shopsToPageElement(shops)
    }, [shops])

    function openDetails(shop: Shop) {
        setSelectedShop(shop)
        closeList()
        mapRef.current?.closePopup()
    }

    function closeDetails() {
        setSelectedShop(undefined)
    }

    function openList(shops: Shop[]) {
        setSelectedList(shops)
        closeDetails()
        mapRef.current?.closePopup()
    }

    function closeList() {
        setSelectedList(undefined)
    }

    const markerIcon: L.Icon = new L.Icon({
        iconUrl: '../images/marker.png',
        iconSize: [30, 30],
    })

    const position: L.LatLngExpression = [47.497913, 19.040236]
    return (
        <Box bgcolor='secondary.main' sx={{ height: `calc(100vh - ${config.headerHeight})`, display: 'flex' }}>
            <Box
                bgcolor='secondary.main'
                sx={{ flex: { xs: selectedShop || selectedList ? '0' : '2', sm: '2' } }}
            >
                <MapContainer
                    center={position}
                    zoom={8}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                    ref={mapRef}
                >
                    <TileLayer
                        attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                        url='https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=QLskrq94oAxIjpIUI8Pm'
                    />
                    { 
                        pageElements.map((element) => element)
                    }
                </MapContainer>
            </Box>
            {selectedShop && (
                <Box
                    sx={{
                        height: '100%',
                        zIndex: '1000',
                        flex: '1',
                        boxShadow: 10,
                        display: 'flex',
                        overflowY: 'scroll',
                    }}
                >
                    <Box
                        style={{
                            height: '100%',
                            width: '100%',
                            padding: '7% 15%',
                        }}
                    >
                        {/* Images */}
                        <Images shopId={selectedShop._id} reviewId={null} />

                        {/* Text */}
                        <Typography
                            variant='h5'
                            color={grey['800']}
                            sx={{ marginBottom: 1, marginTop: '20px' }}
                        >
                            {selectedShop.name}
                        </Typography>
                        <Typography
                            variant='subtitle1'
                            color={grey['700']}
                            sx={{ marginBottom: 1 }}
                        >
                            {dictionary ? dictionary.map.requestor : ''}
                        </Typography>
                        <Typography
                            variant='subtitle2'
                            color={grey['700']}
                            sx={{ marginBottom: 2 }}
                        >
                            {selectedShop.requestor}
                        </Typography>
                        <Typography
                            variant='subtitle1'
                            color={grey['700']}
                            sx={{ marginBottom: 1 }}
                        >
                            {dictionary ? dictionary.map.address : ''}
                        </Typography>
                        <Typography
                            variant='subtitle2'
                            color={grey['700']}
                            sx={{ marginBottom: 3 }}
                        >
                            {selectedShop.address}
                        </Typography>

                        <StyledButtonGroup
                            sx={{ marginBottom: 5 }}
                            variant='text'
                        >
                            <Button onClick={closeDetails}>
                                {dictionary
                                    ? dictionary.navigation.goBackButton
                                    : ''}
                            </Button>

                            {!session?.user?.roles?.includes(
                                UserRole.ADMIN
                            ) && (
                                <Button
                                    onClick={() =>
                                        router.push(
                                            `/${params.lang}/form/${selectedShop._id}`
                                        )
                                    }
                                >
                                    {dictionary
                                        ? dictionary.map.uploadInfoButton
                                        : ''}
                                </Button>
                            )}
                        </StyledButtonGroup>
                    </Box>
                </Box>
            )}
            {selectedList && !selectedShop && (
                <Box
                    sx={{
                        height: '100%',
                        zIndex: '1000',
                        flex: '1',
                        boxShadow: 10,
                        display: 'flex',
                        overflowY: 'scroll',
                    }}
                >
                    <List
                        style={{
                            height: '100%',
                            width: '100%',
                        }}
                    >
                        {  selectedList.map((shop, index) => 
                            <>
                              <StyledListItem 
                                key={index}
                                onClick={() => setSelectedShop(shop)}
                              >
                                <ListItemText
                                    sx={{ padding: '5% 10%' }}
                                    primary={shop.name}
                                    secondary={
                                      <React.Fragment>
                                        <Typography
                                            variant='caption'
                                            color={grey['800']}
                                        >
                                            { shop.name? shop.name : shop.requestor }
                                        </Typography>
                                     </React.Fragment>}
                                />
                              </StyledListItem>
                              <Divider variant="inset" component="li" />
                            </>
                        )}
                    </List>
                </Box>
                )
            }
        </Box>
    )
}
