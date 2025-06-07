"use server"
import * as z from "zod"
import { loginSchemas } from "@/schemas"
import { revalidatePath,revalidateTag } from "next/cache"
export const login = async (values: z.infer<typeof loginSchemas>) => {
	const validated = loginSchemas.safeParse(values);
	if(!validated.success){
		return { error: "Invalid field! "}
	}
	return {success: "Email sent"}
}