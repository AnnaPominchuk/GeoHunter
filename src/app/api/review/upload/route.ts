import { NextRequest, NextResponse } from "next/server";
import getSessionHeader from "@/utils/SessionHeader";

export const POST = async (req:NextRequest) => {
    try {
        const data = await req.json()

        const headers = await getSessionHeader(req)
        headers.set('Content-Type', 'application/json')
        const url = `${process.env.NEXT_PUBLIC_DEV_URL}/review/upload`
        const obj = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        }
        const res = await fetch(url, obj)

        return new NextResponse(JSON.stringify({status : res.status}))
    } catch(error) {
        return new NextResponse(JSON.stringify({error: 'Faild to fetch', status : 500}))
    }
}