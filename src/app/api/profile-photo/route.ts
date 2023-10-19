import { NextRequest, NextResponse } from 'next/server'
import getSessionHeader from '@/utils/SessionHeader'

export const POST = async (req: NextRequest) => {
    try {
        const formData = await req.formData()

        const headers = await getSessionHeader(req)
        const url = `${process.env.NEXT_PUBLIC_DEV_URL}/profile-photo/upload`

        const obj = {
            method: 'POST',
            headers: headers,
            body: formData,
        }

        const res = await fetch(url, obj)

        return new NextResponse(JSON.stringify({ status: res.status }))
    } catch (error) {
        return new NextResponse(
            JSON.stringify({ error: 'Faild to fetch', status: 500 })
        )
    }
}
