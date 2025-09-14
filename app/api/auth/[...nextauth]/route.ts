import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabaseServer } from "@/lib/supabaseServer";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      try {
        // Upsert user and return the UUID
        const { data, error } = await supabaseServer
          .from("users")
          .upsert(
            { email: user.email, name: user.name },
            { onConflict: "email" }
          )
          .select("id") // return the UUID
          .single();

        if (error) {
          console.error("Supabase user upsert error:", error);
          return false;
        }

        // Attach UUID to user object
        user.id = data.id;
        return true;
      } catch (err) {
        console.error("SignIn error:", err);
        return false;
      }
    },

    async jwt({ token, user }) {
      // Store Supabase UUID in JWT
      if (user?.id) {
        token.userId = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.userId, // this is now Supabase UUID
        },
      };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
