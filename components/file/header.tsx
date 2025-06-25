"use client"
import Link from "next/link"
import { Button } from "../ui/button"
import { NavigationMenuDemo } from "./nav"
import { useSession, signOut } from "next-auth/react";

const Header = () => {
    
    
    return (
    <header className="px-8 xl:py-8 ">
        <div className="container mx-auto flex justify-between items-center">
            <Link href='/'>
            <h1 className="text-3xl font-semibold">
                NeoDrive<span className="bg-radial-[at_25%_75%] from-indigo-500 via-purple-500 to-pink-500 to_50% bg-clip-text text-transparent">.</span>
                </h1>
            </Link>
                
            <div className="hidden xl:flex items-center gap-8">
            <NavigationMenuDemo />
               <div className="flex items-center gap-1">
                <Link href="/auth/login">
                <Button variant={'fancy'} className="bg-black text-white dark:bg-white dark:text-black">Login</Button>
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