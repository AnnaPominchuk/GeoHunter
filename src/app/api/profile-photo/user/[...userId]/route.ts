import { NextRequest, NextResponse } from 'next/server'
import getSessionHeader from '@/utils/SessionHeader'

export const GET = async (
    req: NextRequest,
    { params }: { params: { userId: string } }
) => {
    try {
        if (params.userId == 'undefined')
            return new NextResponse(
                JSON.stringify({ error: 'Failed to fetch', status: 500 })
            )

        const headers = await getSessionHeader(req)
        headers.set('Content-Type', 'application/json')
        const url = `${process.env.NEXT_PUBLIC_DEV_URL}/profile-photo/user/${params.userId}`

        const obj = {
            method: 'GET',
            headers: headers,
        }

        const res = await fetch(url, obj)
        const data = await res.json()

        return new NextResponse(JSON.stringify({ status: res.status, data }))
    } catch (error) {
        return new NextResponse(
            JSON.stringify({ error: 'Failed to fetch', status: 500 })
        )
    }
}
