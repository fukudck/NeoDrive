import LoginForm from "@/components/auth/login-form";

const LoginPage = () => {
	return(
		<div className="h-full flex justify-center items-center bg-radial-[at_25%_75%] from-indigo-500 via-purple-500 to-pink-500 to_50%">
			<div>
				<LoginForm />
			</div>
		</div>
	)
}
export default LoginPage;