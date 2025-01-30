"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { FaUser } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ModeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navigation() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 p-8 z-50 flex justify-between items-center">
      <Link
        href="/"
        className="flex items-center w-8 h-8 hover:opacity-80 transition-opacity text-white"
      >
        <Image
          src="/logo.svg"
          alt="Routine Check Logo"
          width={32}
          height={32}
          priority
        />
      </Link>
      <div className="flex gap-4">
        <ModeToggle />
        {status === "authenticated" && session ? (
          <div className="flex items-center gap-4">
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarFallback>
                    <FaUser className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push("/routines")}>
                  Routines
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/calendar")}>
                  Calendar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/change-password")}
                >
                  Change Password
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <>
            <Button onClick={() => router.push("/login")} variant="outline">
              Login
            </Button>
            <Button onClick={() => router.push("/signup")} variant="default">
              Sign Up
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
