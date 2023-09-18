import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const POST = async (req:NextRequest) => {
    try {
        const data = await req.text()
        
        const sessionToken = await getToken({ req });
        if (!sessionToken)
            return new NextResponse(JSON.stringify({error: 'Authorization failed', status : 401}))

        const url = `${process.env.NEXT_PUBLIC_DEV_URL}/shop/create`;
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken.accessToken}`
        });
        
        const obj = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ 
                csvBuffer : data
            })
        }
        console.log(obj)
        const res = await fetch(url, obj);

        return new NextResponse(JSON.stringify({status : res.status}))
    } catch(error) {
        return new NextResponse(JSON.stringify({error: 'Faild to fetch', status : 500}))
      }
}