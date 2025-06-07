"use client"
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";

export const Social = () => {
	return (
		<div className="flex items-center w-full gap-x-2">
			<Button variant="outline" className="w-[50%]" size="lg">
				<FcGoogle />
			</Button>
			<Button variant="default" className="w-[50%]" size="lg">
				<FaGithub className="h-full" />
			</Button>
		</div>
	)
}