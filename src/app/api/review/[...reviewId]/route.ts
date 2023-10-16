import { NextRequest, NextResponse } from "next/server";
import getSessionHeader from "@/utils/SessionHeader";

export const PATCH = async (req:NextRequest, { params }: { params: { reviewId: string } }) => {
    try {
        const headers = await getSessionHeader(req);
        headers.set('Content-Type', 'application/json')
        const url = `${process.env.NEXT_PUBLIC_DEV_URL}/review/${params.reviewId || ''}`;

        const data = await req.json()

        const obj = {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(data)
        }

        const res = await fetch(url, obj);

        return new NextResponse(JSON.stringify({status : res.status }))
    } catch(error) {
        return new NextResponse(JSON.stringify({error: 'Faild to fetch', status : 500}))
    }
}

export const GET = async (req:NextRequest, { params }: { params: { reviewId: string } }) => {
    try {
        const headers = await getSessionHeader(req);
        headers.set('Content-Type', 'application/json')
        const url = `${process.env.NEXT_PUBLIC_DEV_URL}/review/${params.reviewId || ''}`;

        const obj = {
            method: 'GET',
            headers: headers
        }

        const res = await fetch(url, obj);
        const data = await res.json();
        console.log(data)

        return new NextResponse(JSON.stringify({status : res.status, review: data }))
    } catch(error) {
        return new NextResponse(JSON.stringify({error: 'Faild to fetch', status : 500}))
      }
}