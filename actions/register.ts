"use server"
import * as z from "zod"
import { registerSchemas } from "@/schemas"
import { revalidatePath,revalidateTag } from "next/cache"
// import { db } from "@/lib/db"
import bcrypt from "bcrypt"
export const register = async (values: z.infer<typeof registerSchemas>) => {
	const validated = registerSchemas.safeParse(values);
	if(!validated.success){
		return { error: "Invalid field! "}
	}
	const {name, email, password} = validated.data
	// const existEmail = await db.user.findUnique({
	// 	where: {
	// 		email: email,
	// 	}
	// })
	// if(existEmail){
	// 	return {error: "Email already in use!"}
	// }
	const passwordHash = await bcrypt.hash(password, 10)

	// await db.user.create({
	// 	data:{
	// 		name: name,
	// 		email: email,
	// 		password: passwordHash
	// 	}
	// })

	return {success: "User created!!"}
} 