'use client'

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

import { ReactNode } from "react";

const PageTransition = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname()
    return (
        <AnimatePresence>
            <div key={pathname}>
                <motion.div
                    initial={{ opacity:1}}
                    animate={{
                        opacity:0,
                        transition: {delay:0.2, duration:0.4, ease:"easeInOut"}
                    }}
                    className="h-screen w-screen fixed top-0 pointer-events-none bg-white dark:bg-black"
                />
                 {children}   
                

            </div>
        </AnimatePresence>
    )
}
export default PageTransition