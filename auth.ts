import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import Google from "next-auth/providers/google";
//import Facebook from "next-auth/providers/facebook"
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./libs/mongo";

export const runtime = 'nodejs';

const config = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        Resend({
            apiKey: process.env.RESEND_KEY,
            from: "noreply@resend.mysteryboxapp.lat",
            name: "Email",
        }),
        
        
    ],
    adapter: MongoDBAdapter(clientPromise),
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);
        