import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const GET = async (req:NextRequest) => {
    try {
        const sessionToken = await getToken({ req });
        if (!sessionToken)
            return new NextResponse(JSON.stringify({error: 'Authorization failed', status : 401}))

        const url = `${process.env.NEXT_PUBLIC_DEV_URL}/user`;
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken.accessToken}`
        });
        
        const obj = {
            method: 'GET',
            headers: headers,
        }

        const res = await fetch(url, obj);
        const data = await res.json();

        return new NextResponse(JSON.stringify({status : res.status, data: data }))
    } catch(error) {
        return new NextResponse(JSON.stringify({error: 'Faild to fetch', status : 500}))
      }
}