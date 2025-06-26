"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";

export default function UserAvatar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then(res => res.json())
      .then(data => data?.user && setUser(data.user));
  }, []);

  if (!user) {
    return (
      <Link href="/auth/login">
        <Button
          variant="fancy"
          className="bg-black text-white dark:bg-white dark:text-black"
        >
          Login
        </Button>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex border rounded-2xl px-3 py-2 items-center">
        <div className="flex flex-col">
          <p className="text-xs text-neutral-600">Login as</p>
          <p className="text-xs">{user.email}</p>
        </div>
        <Avatar className="h-8 w-8 mx-2">
          <AvatarImage
            src={user.image || "/images/header-design.png"}
            alt="User avatar"
          />
          <AvatarFallback className="bg-gradient-to-br from-orange-400 to-blue-500 text-white text-sm">
            {user.name?.[0] ?? "U"}
          </AvatarFallback>
        </Avatar>
      </div>
      <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/auth/login" })}>
        Logout
      </Button>
    </div>
  );
}
