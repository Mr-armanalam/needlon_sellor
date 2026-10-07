import { db } from "@/db";
import { DrizzleError, eq } from "drizzle-orm";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import type { NextAuthConfig } from "next-auth";
import { usersTable } from "@/db/schema/users";
import { bcryptCompare } from "../../../lib/bcrypt";

export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      authorize: async (credentials) => {
        try {
          if (!credentials) return null;

          const email = credentials.email;
          const password = credentials.password;

          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required.");
          }

          if (typeof email !== "string" || typeof password !== "string") {
            throw new Error("Invalid email or password.");
          }

          const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));

          if (!user) {
            throw new Error("No user found with this email.");
          }

          // console.log(email, password, 'auth-data1');
          

          const isPasswordValid = await bcryptCompare(password, user.password!);
          // console.log(isPasswordValid, 'auth-data2');
          

          if (!isPasswordValid) throw new Error("Invalid password.");

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            image: user.imageUrl ?? "",
          };
        } catch (error: any) {
          console.error("Authorize error:", error);
          throw new Error(error.message);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) {
        throw new DrizzleError({
          message: "User email is undefined",
          cause: "User email is required for sign-in",
        });
      }
      const [existingUser] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable?.email, user.email));

      if (!existingUser) {
        const [newUser] = await db
          .insert(usersTable)
          .values({
            name: user.name || "",
            email: user.email,
            imageUrl: user.image,
          })
          .returning();

        user.id = newUser.id.toString();
      } else {
        user.id = existingUser.id.toString();
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email!;
        token.name = user.name;
        token.image = user.image;
      }
      return token as typeof token & NextAuthJWT;
    },
    async session({ session, token }) {
      if (!token.id || !token.email) {
        throw new Error("Invalid auth token");
      }

      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = (token.name as string) ?? null;
      session.user.image = (token.image as string) ?? null;

      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};
