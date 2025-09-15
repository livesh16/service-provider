import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// This is used in /api/auth/[...nextauth]/route.ts to give the User object an id attribute.

/**
 * This file augments the default NextAuth types to include the `id` field 
 * on the `User` and `Session` objects. 
 *
 * Why this is needed:
 * 1. By default, NextAuth's `User` type only includes `name`, `email`, and `image`.
 *    It does NOT include a unique identifier (e.g., Supabase UUID) for the user.
 * 2. In our application, we are storing users in Supabase and want to attach 
 *    the user's UUID (`id`) to the session and JWT token.
 * 3. Without this type augmentation, TypeScript will throw errors whenever we 
 *    try to access `user.id` or `session.user.id`:
 *       Property 'id' does not exist on type 'User | DefaultUser'
 * 4. A common workaround is to cast the user as `any`:
 *       (user as any).id = data.id
 *    But using `any` defeats TypeScript's type safety and can hide errors.
 * 5. By augmenting the types here, we:
 *    - Ensure `user.id` exists on the `User` object returned by NextAuth callbacks.
 *    - Ensure `session.user.id` exists on the `Session` object used in our frontend.
 *    - Avoid `any` casts and maintain full type safety throughout the app.
 *
 * In short: This file makes our custom `id` field on NextAuth users officially
 * recognized by TypeScript, so we can safely store and access Supabase UUIDs
 * in JWTs and sessions.
 */

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
  }
}
