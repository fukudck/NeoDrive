import RegisterForm from "@/components/auth/register-form";

const RegisterPage = () => {
	return(
		<div className="h-full flex justify-center items-center bg-radial-[at_25%_75%] from-indigo-500 via-purple-500 to-pink-500 to_50%">
			<div>
				<RegisterForm />
			</div>
		</div>
	)
}
export default RegisterPage;