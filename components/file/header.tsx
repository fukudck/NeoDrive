import Link from "next/link"
import { Button } from "../ui/button"
import Nav from "./nav"

const Header = () => {
    return (
    <header className="px-8 xl:py-8 border ">
        <div className="container mx-auto flex justify-between items-center">
            <Link href='/'>
            <h1 className="text-3xl font-semibold">
                NeoDrive<span className="bg-radial-[at_25%_75%] from-indigo-500 via-purple-500 to-pink-500 to_50% bg-clip-text text-transparent">.</span>
                </h1>
            </Link>


            <div className="hidden xl:flex items-center gap-8">
               <Nav />
               <div className="flex items-center gap-1">
                <Link href="/auth/login">
                <Button>Login</Button>
               </Link>
               <Link href="/auth/register">
                <Button>Register</Button>
               </Link>
               </div>
            </div>
            

            <div className="xl:hidden">
                Mobile Nav
            </div>
        </div>
    </header>
    )
}

export default Header