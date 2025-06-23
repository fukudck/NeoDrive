import { auth, signIn, signOut } from "@/auth"
import { Button } from "@/components/ui/button";
export const  SettingPage = async () => {
	const session = await auth();
	console.log(session);
	
	return (
		<>
		
		{JSON.stringify(session)}
		<form action={async () => {
			"use server"
			await	signOut({
				redirectTo: "/auth/login"
			})
		}}>
			<Button type="submit">Logout</Button>
		</form>

		</>
	)
}
export default SettingPage;