import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import {prisma} from "../../../../../prisma";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { User } from "@prisma/client";


export const authOptions: NextAuthOptions = {
    providers : [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: {label:"Email", type:"text"},
                password: {label: "Password", type:"password"}
            },
            async authorize(credentials: { email: string; password: string; } | undefined): Promise<User | null>{
                if (!credentials) return null;
                try {
                    const user = await prisma.user.findFirst({
                            where: {
                                email: credentials.email.toLowerCase(),
                                isVerified: true
                            }
                        })
                    if(!user){
                        throw new Error("No user found with this email")
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if(isPasswordCorrect){
                        return user
                    }else{
                        throw new Error("Password is incorrect")
                    }
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        throw new Error(error.message)
                    }
                    throw new Error('An unexpected error occurred')
                }
            }
        })
    ],
    pages: {
        signIn : '/sign-in',
        signOut: '/sign-out'
    },
    session: {
        strategy: "jwt"
    },
    secret : process.env.NEXTAUTH_SECRET,
    adapter: PrismaAdapter(prisma),
    callbacks: {
        async session({ session, token }) {
            if(token){
                session.user._id = token._id?.toString();
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.username = token.username;
            }
          return session
        },
        async jwt({ token, user}) {
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.username = user.username;
            }
            return token
        }
    }
}
