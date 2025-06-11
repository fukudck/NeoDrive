import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google"; 
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

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
      <div className="w-fullbg-radial-[at_25%_75%] from-indigo-500 via-purple-500 to-pink-500 to_50% fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink>Link</NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>

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
