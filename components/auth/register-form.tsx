'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"
import * as z from "zod"
import {Form, FormControl, FormField, FormMessage, FormLabel, FormItem} from "@/components/ui/form"
import { CardWrapper } from "./card-wrapper";
import { registerSchemas } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from '../form-error'
import { FormSuccess } from "../form-success";
import { register } from "@/actions/register";
import { useState, useTransition } from "react";

const RegisterForm = () => {
	const [error, setError] = useState<string | undefined>();
	const [success, setSuccess] = useState<string | undefined>();
	const [isPending, startTransition] = useTransition()
	const form = useForm<z.infer<typeof registerSchemas>>({
		resolver: zodResolver(registerSchemas),
		defaultValues: {
			name: "",
			email: "",
			password: ""
		}
	});
	const onsubmit = (values: z.infer<typeof registerSchemas>) => {
		startTransition(() => {
			register(values)
			.then((data) => {
				setError(data.error);
				setSuccess(data.success)
			})
		})
	}
	
	
	return(
		<CardWrapper
			headerLabel="Create an account"
			backButtonLabel="Already have an account?"
			backButtonHref="/auth/login"
			showSocial
		 >
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onsubmit)} className="space-y-8">
					<div className="space-y-6">
						<FormField control={form.control} name="name" render={({field}) => (
						<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl> 
									<Input {...field} placeholder="John Doe" disabled={isPending}/>
								</FormControl>
							<FormMessage />
						</FormItem>
					)} />
						<FormField control={form.control} name="email" render={({field}) => (
						<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl> 
									<Input {...field} placeholder="john.doe@example.com" type="email" disabled={isPending}/>
								</FormControl>
							<FormMessage />
						</FormItem>
					)} />
					<FormField control={form.control} name="password" render={({field}) => (
						<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input placeholder="******" type="password" {...field} disabled={isPending}/>
								</FormControl>
							<FormMessage />
						</FormItem>
					)} />
					</div>
					<FormError message={error} />
					<FormSuccess message={success}/>
					<Button type="submit" className="w-full" disabled={isPending}>Register</Button>
				</form>
			</Form>
		</CardWrapper>
	)
}
export default RegisterForm;