import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare global {
  interface NextAuthJWT {
    id?: string;
    email?: string;
    name?: string | null;
    image?: string | null;
  }
}

export {};
