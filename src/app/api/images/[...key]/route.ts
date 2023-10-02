import { NextRequest, NextResponse } from "next/server";
import getSessionHeader from "@/utils/SessionHeader";

export const GET = async (req:NextRequest, { params }: { params: { key: string } }) => {
    try {
        const headers = await getSessionHeader(req);
        headers.set('Content-Type', 'application/json')
        const url = `${process.env.NEXT_PUBLIC_DEV_URL}/images/${params.key}`;

        const obj = {
            method: 'GET',
            headers: headers,
        }

        const res = await fetch(url, obj);

        return new  NextResponse(JSON.stringify({status : res.status }))
    } catch(error) {
        return new NextResponse(JSON.stringify({error: 'Faild to fetch', status : 500}))
      }
}