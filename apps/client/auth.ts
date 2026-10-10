import { authOptions } from "@/modules/auth/auth-option/auth-data";
import NextAuth from "next-auth";

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authOptions,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
});
