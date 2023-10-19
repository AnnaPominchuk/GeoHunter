import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const getSessionHeader = async (req: NextRequest): Promise<Headers> => {
    const sessionToken = await getToken({ req })

    const headers = new Headers({})

    if (sessionToken) {
        headers.set('Authorization', `Bearer ${sessionToken.accessToken}`)
    }

    return headers
}

export default getSessionHeader
