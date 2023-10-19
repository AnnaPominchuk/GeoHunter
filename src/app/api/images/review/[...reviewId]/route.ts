import { NextRequest, NextResponse } from 'next/server'
import getSessionHeader from '@/utils/SessionHeader'

export const GET = async (
    req: NextRequest,
    { params }: { params: { reviewId: string } }
) => {
    try {
        const headers = await getSessionHeader(req)
        headers.set('Content-Type', 'application/json')
        const url = `${process.env.NEXT_PUBLIC_DEV_URL}/images/review/${
            params.reviewId || ''
        }`

        const obj = {
            method: 'GET',
            headers: headers,
        }

        const res = await fetch(url, obj)
        const data = await res.json()

        return new NextResponse(JSON.stringify({ status: res.status, data }))
    } catch (error) {
        return new NextResponse(
            JSON.stringify({ error: 'Faild to fetch', status: 500 })
        )
    }
}
