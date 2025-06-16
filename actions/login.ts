"use server"
import * as z from "zod"
import { loginSchemas } from "@/schemas"
import { signIn } from "@/auth"
import { default_login_redirect } from "@/routes"
import { AuthError } from "next-auth"
export const login = async (values: z.infer<typeof loginSchemas>) => {
	const validated = loginSchemas.safeParse(values);
	if(!validated.success){
		return { error: "Invalid field! "}
	}
	const {email, password} = validated.data
	try {
		await signIn("credentials", {
			email, password, redirectTo: default_login_redirect
		})
	} catch (error) {
		if(error instanceof AuthError){
			switch (error.type) {
				case "CredentialsSignin":
					return {error: "Invalid credentials!"}
				
				default:
					return {error: "Something went wrong!"}
			}
		}
		throw error
	}
	return {success: "Email sent"}
}