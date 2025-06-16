import NextAuth from "next-auth"
import authConfig from "./auth.config"
import {PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./lib/db"
import Credentials from "next-auth/providers/credentials"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { loginSchemas } from "./schemas"
import { getUserByEmail } from "@/data/user"
import { getUserById } from "@/data/user"
import bcrypt from 'bcrypt'
export const { auth, handlers, signIn, signOut } = NextAuth({
	adapter: PrismaAdapter(db),
	session: { strategy: "jwt" },
	...authConfig,
	callbacks: {
		async session({token, session}){
			if(token.sub && session.user){
				session.user.id = token.sub
			}
			if(session.user && token.role){
				session.user.role = token.role
			}			
			return session
		},
		async jwt({token}) {
			if(!token.sub){
				return token;
			}	
			const user = await getUserById(token.sub)
			if(!user){
				return token;
			}
			token.role = user.role
			return token;
    }
	},
	providers: [
		Credentials({
			async authorize(credentials) {
			const validated = loginSchemas.safeParse(credentials);
			if(validated.success){
				const {email, password} = validated.data
				const user = await getUserByEmail(email);
				if(!user || !user.password){
					return null;
				}
				const passwordMatch =  await bcrypt.compare(password, user.password);
				if(passwordMatch) return user;
			}
			return null;
		}
	}),

	]
})
