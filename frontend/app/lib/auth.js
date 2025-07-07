import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google-login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
              googleId: account.providerAccountId,
            }),
          });
          const data = await res.json();
          token.backendToken = data.token;
          token.role = data.user.role;
          token.userId = data.user._id;
        } catch (err) {
          console.error("JWT callback backend login failed:", err);
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user.token = token.backendToken || null;
      session.user.role = token.role || "user";
      session.user.id = token.userId || null;
      return session;
    },
  },
});