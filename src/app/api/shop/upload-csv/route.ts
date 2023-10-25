import { NextRequest, NextResponse } from 'next/server'
import getSessionHeader from '@/utils/SessionHeader'

export const POST = async (req: NextRequest) => {
    try {
        const data = await req.text()

        const headers = await getSessionHeader(req)
        headers.set('Content-Type', 'application/json')
        const url = `${process.env.NEXT_PUBLIC_DEV_URL}/shop/create`

        const obj = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                csvBuffer: data,
            }),
        }

        const res = await fetch(url, obj)

        return NextResponse.json({ body: res.body }, { status: res.status })
    } catch (error) {
        return NextResponse.json({ error: 'Faild to fetch' }, { status: 500 })
    }
}
