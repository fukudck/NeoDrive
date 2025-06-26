"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { NavigationMenuDemo } from "./nav";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CiMenuFries } from "react-icons/ci";
import { ThemeSwitcher } from "../theme";
import UserAvatar from "@/components/avatar-header";

const Header = () => {
  return (
    <header className="px-8 xl:py-8">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <h1 className="text-3xl font-semibold">
            NeoDrive
            <span className="bg-radial-[at_25%_75%] from-indigo-500 via-purple-500 to-pink-500 to_50% bg-clip-text text-transparent">
              .
            </span>
          </h1>
        </Link>

        {/* Desktop */}
        <div className="hidden xl:flex items-center gap-8">
          <NavigationMenuDemo />
          <ThemeSwitcher />
          <UserAvatar />
        </div>

        {/* Mobile */}
        <div className="xl:hidden">
          <Sheet>
            <SheetTrigger>
              <CiMenuFries size={24} />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader className="mt-6">
                <div className="flex flex-col items-center gap-6">
                  <UserAvatar />
                  <nav className="flex flex-col items-center gap-4">
                    <Link href="/p2p" className="text-lg">P2P</Link>
                    <Link href="/transfers" className="text-lg">Transfers</Link>
                    <ThemeSwitcher />
                  </nav>
                </div>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
