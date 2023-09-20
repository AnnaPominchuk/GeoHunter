import NextAuth, {Account, Profile, Session, User} from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";

async function sendTokenToBackend(message: {user: User, account: Account | null, profile? : Profile | undefined, isNewUser? : boolean | undefined }) {
    const url = `${process.env.NEXT_PUBLIC_DEV_URL}/user/login`;
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${message.account?.access_token}`
    });
    const body =  {
        'email': message.user.email,
        'name': message.user.email,
        'lastname': message.user.email
    };
    return await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    });
}

export const authOptions = {
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID ?? '',
      clientSecret: process.env.AUTH0_CLIENT_SECRET ?? '',
      issuer: process.env.AUTH0_ISSUER ?? '',
      authorization: {
        params: {
          audience: encodeURI(process.env.AUTH0_AUDIENCE ?? '')
        }
      },
    })
  ],
  events: {
    signIn:
        async (message: {user: User, account: Account | null, profile? : Profile | undefined, isNewUser? : boolean | undefined }) => {
          const result = await sendTokenToBackend(message);
          if (result.status === 401) {
            console.error('Authorization failed');
          }
    }
  },
  callbacks: {
    async session(params: { session: Session, token: JWT, user: User | AdapterUser}) {

      if (params.token?.roles) {
        params.session.user.roles = params.token.roles
      }
  
      return params.session;
    },
    async jwt(params: { token: JWT, user?: User | AdapterUser | undefined; account?: Account | null | undefined; profile?: Profile | undefined; isNewUser?: boolean | undefined }) {
      if (params.account) {
        params.token.accessToken = params.account.access_token;
      }

      if (params.profile) {
        params.token.roles = params.profile.appRoles;
      }

      return params.token;
    }
  }
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };