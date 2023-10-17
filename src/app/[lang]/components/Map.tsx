'use client'

import { useState, useEffect, useRef } from 'react'
import { Convert, Shop } from '@/model/Shop'

import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

import Images from './Images'

import { Box, Typography, Button, ButtonGroup } from '@mui/material'
import { useRouter } from 'next/navigation'
import { Props } from '@/utils/Props'
import { getDictionary } from '@/lib/dictionary'
import UserRole from '@/utils/UserRole'

import { useSession } from 'next-auth/react'

import { styled } from '@mui/material/styles'
import { grey } from '@mui/material/colors'

const StyledButtonGroup = styled(ButtonGroup)({
    '& .MuiButtonGroup-grouped': {
        borderColor: 'white',
    },
})

export default function Map({ params }: Props) {
    const [dictionary, setDictionary] = useState<any>()
    useEffect(() => {
        const setDict = async () => {
            const dict = await getDictionary(params.lang)
            setDictionary(dict)
        }

        setDict()
    }, [params.lang])

    const router = useRouter()
    const [shops, setShops] = useState<Shop[]>([])
    const [selectedShop, setSelectedShop] = useState<Shop | undefined>(
        undefined
    )
    const { data: session } = useSession()

    const mapRef = useRef(null)

    useEffect(() => {
        async function getShops() {
            try {
                const res = await fetch('../api/shop', {
                    method: 'GET',
                })
                const data = await res.json()

                const shopsList: Shop[] = []
                for (const shopData of data.shops.shops) {
                    const shop: Shop = Convert.toShop(JSON.stringify(shopData))
                    shopsList.push(shop)
                }
                setShops(shopsList)
            } catch (e) {
                console.error('Handle error', e)
            }
        }
        getShops()
    }, [selectedShop])

    function openDetails(shop: Shop) {
        setSelectedShop(shop)
        mapRef.current.closePopup()
    }

    function closeDetails() {
        setSelectedShop(undefined)
    }

    const markerIcon: L.Icon = new L.Icon({
        iconUrl: '../marker.png',
        iconSize: [30, 30],
    })

    const position: L.LatLngExpression = [47.497913, 19.040236]
    return (
        // TO DO: sizing
        <Box bgcolor="secondary.main" sx={{ height: '92vh', display: 'flex' }}>
            <Box
                bgcolor="secondary.main"
                sx={{ flex: { xs: selectedShop ? '0' : '2', sm: '2' } }}
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
                        url="https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=QLskrq94oAxIjpIUI8Pm"
                    />
                    {shops.map((shop, index) => (
                        <Marker
                            position={[shop.latitude, shop.longitude]}
                            icon={markerIcon}
                            key={`${shop.name}-${shop.amount}-${index}`}
                        >
                            <Popup>
                                <Box>
                                    <Box sx={{ padding: '10px' }}>
                                        <Typography variant="subtitle1">
                                            {dictionary
                                                ? dictionary.map.requestor
                                                : ''}
                                        </Typography>
                                        <Typography variant="caption">
                                            {shop.name}
                                        </Typography>
                                    </Box>
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
                    ))}
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
                        <Images shopId={selectedShop._id} />

                        {/* Text */}
                        <Typography variant="h5" color={grey['800']}>
                            {selectedShop.name}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            color={grey['700']}
                            sx={{ marginBottom: '10px' }}
                        >
                            {dictionary ? dictionary.map.requestor : ''}
                        </Typography>
                        <Typography
                            variant="subtitle2"
                            color={grey['700']}
                            sx={{ marginBottom: '30px' }}
                        >
                            {selectedShop.name}
                        </Typography>

                        <StyledButtonGroup
                            sx={{ marginBottom: 5 }}
                            variant="text"
                        >
                            <Button onClick={closeDetails}>
                                {dictionary
                                    ? dictionary.navigation.goBackButton
                                    : ''}
                            </Button>
                            {session?.user?.roles?.includes(UserRole.ADMIN) && (
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
        </Box>
    )
}
