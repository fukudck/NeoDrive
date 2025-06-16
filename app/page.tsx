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
import { FileUpload } from "@/components/file/file-upload";
import * as FadeIn from "@/components/motion/fade";

const font = Poppins({
  subsets: ['latin'],
  weight: ['600']
})
export default function Home() {
  return(
    // <main className="flex h-full flex-col items-center
    //  justify-center 
    // bg-radial-[at_25%_75%] from-indigo-500 via-purple-500 to-pink-500 to_50%

    //  ">
    //   <div className="w-fullbg-radial-[at_25%_75%] from-indigo-500 via-purple-500 to-pink-500 to_50% fixed top-0 left-0 z-50">
    //     <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
    //       <NavigationMenu  viewport={false}>
    //         <NavigationMenuList>
    //           <NavigationMenuItem>
    //             <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
    //             <NavigationMenuContent>
    //               <ul className="grid md:w-[200px] lg:w-[300px] grid-cols-3 gap-4" >
    //                 <NavigationMenuLink className="bg-amber-300">Link</NavigationMenuLink>
    //                 <NavigationMenuLink className="bg-amber-500">1</NavigationMenuLink>
    //                 <NavigationMenuLink className="bg-amber-500">2</NavigationMenuLink>
    //               </ul>
    //             </NavigationMenuContent>
    //           </NavigationMenuItem>
    //           <NavigationMenuItem>
    //             <NavigationMenuTrigger>Item Two</NavigationMenuTrigger>
    //             <NavigationMenuContent>
    //               <ul className="grid lg:w-[400px]">
    //                 <NavigationMenuLink>Link</NavigationMenuLink>
    //               </ul>
    //             </NavigationMenuContent>
    //           </NavigationMenuItem>
    //         </NavigationMenuList>
    //       </NavigationMenu>
    //     </div>
    //   </div>

    //   <div className="space-y-6 text-center">
    //     <h1 className={cn("text-6xl font-semibold text-white drop-shadow-md", font.className)}>Neo Drive</h1>
    //     <p className="text-lg text-white">sent file online</p>
    //     <div>
    //       <LoginButton>
    //         <Button variant="secondary" size="lg">Sign in</Button>
    //       </LoginButton>
          
    //    </div>
    //   </div>
      
    // </main>
    <>
      <FadeIn.Container className="flex flex-col gap-6">
      <FadeIn.Item>
        <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
          <FileUpload />
        </div>
      </FadeIn.Item>

      {/* <FadeIn.Item>
        <Footer />
      </FadeIn.Item> */}
    </FadeIn.Container>
    </>
  )
}
