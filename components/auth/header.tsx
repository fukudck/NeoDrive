import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { FaLock } from "react-icons/fa";
const font = Poppins({
	subsets: ['latin'],
	weight: ['600']

})
interface HeaderProps {
	label: String, 
}
export const Header = ({label}: HeaderProps) => {
	return (
		<div className="w-full flex flex-col gap-y-6 items-center justify-center">
			<h1 className={cn("text-3xl font-semibold", font.className)}>
			<div className="flex items-center justify-center gap-2">
					<FaLock className="text-[25px] text-[#b3ff02]"  />
				<span className="bg-gradient-to-r from-lime-400 to-fuchsia-600 bg-clip-text text-transparent">NeoDrive</span>
			</div>
			</h1>
			<p className="text-muted-foreground text-sm">{label}</p>
		</div>
	)
}
