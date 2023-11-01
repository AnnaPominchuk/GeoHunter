import { NextRequest, NextResponse } from 'next/server'
import getSessionHeader from '@/utils/SessionHeader'

export const PATCH = async (
    req: NextRequest,
    { params }: { params: { id: string } }
) => {
    try {
        // API Managment options
        const headersToken = new Headers({})
        headersToken.set('Content-Type', 'application/json')

        const tokenOptions = {
            method: 'POST',
            headers: headersToken,
            body: JSON.stringify({
                grant_type: 'client_credentials',
                client_id: process.env.AUTH0_CLIENT_ID,
                client_secret: process.env.AUTH0_CLIENT_SECRET,
                audience: `${process.env.AUTH0_ISSUER}/api/v2/`
            })
        };

        // BE options
        const body = await req.json()

        const headersBE = await getSessionHeader(req)
        headersBE.set('Content-Type', 'application/json')
        const url = `${process.env.NEXT_PUBLIC_DEV_URL}/user/${
            params.id || ''
        }`

        const obj = {
            method: 'PATCH',
            headers: headersBE,
            body:  JSON.stringify(body)
        }

        // Auth0 Patch User options
        let bearerToken: string = ''

        const result: {status:number, data:string} = {status: 0, data: ''}

        // GET API Managment token
        await fetch(`${process.env.AUTH0_ISSUER}/oauth/token`, tokenOptions)
            .then((res) => res.json())
            .then((dataToken) => {
                bearerToken = dataToken.access_token
            })
            .then(() => {
                // PATCH DB User 
                return fetch(url, obj)
            })
            .then((res) => res.json())
            .then((resJson) => {
                 // PATCH Auth0 User
                const headersPatch = new Headers({})
                headersPatch.set('Content-Type', 'application/json')
                headersPatch.set("Accept", "application/json");
                headersPatch.set('authorization', `Bearer ${bearerToken}`)

                const options = {
                    method: 'PATCH',
                    headers: headersPatch,
                    body:  JSON.stringify(body)
                };

                return fetch(`${process.env.AUTH0_ISSUER}/api/v2/users/${resJson.authId || ''}`, options)
            })
            .then((res) => {
                result.status = res.status
                return res.json()
            })
            .then((resJson) => {
                result.data = resJson.data
            })
            .catch((error) => console.error(error))
    
        return new NextResponse(
            JSON.stringify(result)
        )
    } catch (error) {
        return new NextResponse(
            JSON.stringify({ error: 'Failed to fetch', status: 500 })
        )
    }
}
