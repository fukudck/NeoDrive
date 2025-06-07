import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google"; 

const font = Poppins({
  subsets: ['latin'],
  weight: ['600']
})
export default function Home() {
  return(
    <main className="flex h-full flex-col items-center
     justify-center 
    bg-radial-[at_25%_75%] from-indigo-500 via-purple-500 to-pink-500 to_50%

     ">
      <div className="space-y-6 text-center">
        <h1 className={cn("text-6xl font-semibold text-white drop-shadow-md", font.className)}>Neo Drive</h1>
        <p className="text-lg text-white">sent file online</p>
        <div>
          <LoginButton>
            <Button variant="secondary" size="lg">Sign in</Button>
          </LoginButton>
          
       </div>
      </div>
      
    </main>
  )
}
