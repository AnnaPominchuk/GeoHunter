import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
      roles?: string[]
  }
  
  interface Session extends DefaultSession {
      user: User;
  }

  interface Profile extends DefaultProfile {
    appRoles?: string[]
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    roles?: string[],
    accessToken: string
  }
}