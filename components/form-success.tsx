import { FaCircleCheck } from "react-icons/fa6";

interface FormSuccessProps{
	message?: String
}
export const FormSuccess = ({message} : FormSuccessProps) => {
	if(!message) return null

	return(
		<div className="bg-emerald-500/15 p-3 flex items-center gap-x-2 rounded-md text-sm text-emerald-500">
			<FaCircleCheck className="w-4 h-4"/>
			<p>{message}</p>

		</div>
	)
}
