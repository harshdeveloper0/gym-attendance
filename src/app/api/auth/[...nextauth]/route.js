import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [];

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.role = ADMIN_EMAILS.includes(user.email) ? "admin" : "user";
      } else {
        token.role = ADMIN_EMAILS.includes(token.email) ? "admin" : "user";
      }
      return token;
    },

    async session({ session, token }) {
      session.user.email = token.email;
      session.user.role = token.role;
      return session;
    },
  },
};


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
