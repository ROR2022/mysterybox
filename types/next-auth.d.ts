import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    role?: string
    id?: string
  }

  interface Session {
    user?: {
      role?: string
      id?: string
    } & DefaultSession["user"]
  }
} 