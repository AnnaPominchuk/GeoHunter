import { NextRequest, NextResponse } from 'next/server'
import getSessionHeader from '@/utils/SessionHeader'

export const GET = async (
    req: NextRequest,
    { params }: { params: { email: string } }
) => {
    try {
        const headers = await getSessionHeader(req)
        headers.set('Content-Type', 'application/json')
        const url = `${process.env.NEXT_PUBLIC_DEV_URL}/user/${
            params.email || ''
        }`

        const obj = {
            method: 'GET',
            headers: headers,
        }

        const res = await fetch(url, obj)
        const data = await res.json()

        return new NextResponse(
            JSON.stringify({ status: res.status, data: data })
        )
    } catch (error) {
        return new NextResponse(
            JSON.stringify({ error: 'Faild to fetch', status: 500 })
        )
    }
}

export const PATCH = async (
    req: NextRequest,
    { params }: { params: { email: string } }
) => {
    try {
        const headers = await getSessionHeader(req)
        headers.set('Content-Type', 'application/json')
        const url = `${process.env.NEXT_PUBLIC_DEV_URL}/user/${
            params.email || ''
        }`

        const body = await req.json()

        console.log({ body: body })

        const obj = {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(body),
        }

        const res = await fetch(url, obj)

        return new NextResponse(JSON.stringify({ status: res.status }))
    } catch (error) {
        return new NextResponse(
            JSON.stringify({ error: 'Faild to fetch', status: 500 })
        )
    }
}
