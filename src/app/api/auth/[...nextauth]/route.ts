import NextAuth, { Account, Profile, Session, User } from 'next-auth'
import Auth0Provider from 'next-auth/providers/auth0'
import { JWT } from 'next-auth/jwt'
import { AdapterUser } from 'next-auth/adapters'

interface Message {
    user: User
    account: Account | null
    profile?: Profile | undefined
    isNewUser?: boolean | undefined
}

async function sendTokenToBackend(message: Message) {
    const url = `${process.env.NEXT_PUBLIC_DEV_URL}/user/login`
    const headers = new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${message.account?.access_token}`,
    })
    const body = {
        email: message.user.email,
        name: message.user.name,
        photoURL: message.user.image,
    }
    return await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    })
}

async function patchUser(token: string, email: string, roles: string[]) {
    const url = `${process.env.NEXT_PUBLIC_DEV_URL}/user/${email}`
    const headers = new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    })
    const body = { roles: roles }
    await fetch(url, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify(body),
    })
}

const authOptions = {
    providers: [
        Auth0Provider({
            clientId: process.env.AUTH0_CLIENT_ID ?? '',
            clientSecret: process.env.AUTH0_CLIENT_SECRET ?? '',
            issuer: process.env.AUTH0_ISSUER ?? '',
            authorization: {
                params: {
                    audience: encodeURI(process.env.AUTH0_AUDIENCE ?? ''),
                    prompt: 'login',
                },
            },
        }),
    ],
    events: {
        signIn: async (message: Message) => {
            const result = await sendTokenToBackend(message)
            if (result.status === 401) {
                console.error('Authorization failed')
            }
        },
    },
    callbacks: {
        async session(params: {
            session: Session
            token: JWT
            user: User | AdapterUser
        }) {
            if (params.token?.roles) {
                params.session.user.roles = params.token.roles
                // TO DO: change this with Auth0 action after deploing
                await patchUser(
                    params.token.accessToken,
                    params.session.user.email ?? '',
                    params.token.roles
                )
            }

            return params.session
        },
        async jwt(params: {
            token: JWT
            user?: User | AdapterUser | undefined
            account?: Account | null | undefined
            profile?: Profile | undefined
            isNewUser?: boolean | undefined
        }) {
            if (params.account) {
                params.token.accessToken = params.account.access_token ?? ''
            }

            if (params.profile) {
                params.token.roles = params.profile.appRoles
            }

            return params.token
        },
    },
}
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
