import { emailOTPClient, genericOAuthClient, magicLinkClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

export const client = createAuthClient({
  plugins: [
    genericOAuthClient(), 
    emailOTPClient(),
    magicLinkClient(),
  ],
})
export const { useSession } = client

export const { signIn, signUp, signOut } = client
