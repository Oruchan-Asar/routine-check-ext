"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { FaUser } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ModeToggle";

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
            <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center">
              <FaUser size={20} />
            </div>
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
