import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabaseServer } from "@/lib/supabaseServer";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

// Define auth options with types
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }): Promise<boolean> {
      if (!user.email) return false;

      try {
        const { data, error } = await supabaseServer
          .from("users")
          .upsert(
            { email: user.email, name: user.name },
            { onConflict: "email" }
          )
          .select("id")
          .single();

        if (error) {
          console.error("Supabase user upsert error:", error);
          return false;
        }

        // Attach Supabase UUID to user
        (user as typeof user & { id: string }).id = data.id;
        return true;
      } catch (err) {
        console.error("SignIn error:", err);
        return false;
      }
    },

    async jwt({ token, user }): Promise<JWT> {
      if (user && "id" in user) {
        token.userId = (user as { id: string }).id;
      }
      return token;
    },

    async session({ session, token }): Promise<Session> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.userId as string,
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
