import { NextRequest, NextResponse } from 'next/server'
import getSessionHeader from '@/utils/SessionHeader'

export const POST = async (req: NextRequest) => {
    try {
        const formData = await req.formData()

        const headers = await getSessionHeader(req)
        const url = `${process.env.NEXT_PUBLIC_DEV_URL}/images`

        const obj = {
            method: 'POST',
            headers: headers,
            body: formData,
        }

        const res = await fetch(url, obj)
        const resJson = await res.json()

        return new NextResponse(
            JSON.stringify({ status: res.status, data: resJson })
        )
    } catch (error) {
        return new NextResponse(
            JSON.stringify({ error: 'Failed to fetch', status: 500 })
        )
    }
}
