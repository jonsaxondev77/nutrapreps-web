import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const useSecureCookies = process.env.NODE_ENV === 'production';
const cookiePrefix = useSecureCookies ? "__Secure-" : "";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
            const authUrl = `${process.env.NEXT_PUBLIC_API_URL}/accounts/authenticate`;
            const response = await fetch(authUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });

            if(!response.ok) {
                const errorText = await response.text();
                console.error('Backend returned an error:', errorText);
                return null;
            }

            const userData = await response.json();

            return userData;

        } catch(error) {
            console.error('Authorize: Network error or unexpected issue during authentication:', error);
            return null;
        }
      }
    }),
    CredentialsProvider({
        id: "email-verification",
        name: "EmailVerification",
        credentials: {
            userData: { label: "User Data", type: "text" }
        },
        async authorize(credentials) {
            if (credentials?.userData) {
                try {
                    const user = JSON.parse(credentials.userData);
                    return user;
                } catch (e) {
                    console.error("Failed to parse user data for email verification sign in:", e);
                    return null;
                }
            }
            return null;
        }
    })
  ],
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token.web`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    callbackUrl: {
      name: `${cookiePrefix}next-auth.callback-url.web`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    csrfToken: {
      name: `${useSecureCookies ? "__Host-" : ""}next-auth.csrf-token.web`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
  },
  pages: {
    signIn: '/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 3600
  },
  jwt: {
    maxAge: 3600
  },
  callbacks: {
    async jwt({token, user}) {
        if(user) {
            token.id = user.id;
            token.jwtToken = user.jwtToken;
            token.role = user.role;
        }
        return token;
    },
    async session({session, token}) {
        if(token) {
            session.user.role = token.role;
            session.user.jwtToken = token.jwtToken;
        }
        return session;
    }
  }
};