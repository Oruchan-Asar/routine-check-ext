"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { FaUser } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

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
          alt="Todo Check Logo"
          width={32}
          height={32}
          priority
        />
      </Link>
      <div className="flex gap-4">
        {status === "authenticated" && session ? (
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm h-10 px-4"
            >
              Logout
            </button>
            <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center">
              <FaUser size={20} />
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={() => router.push("/login")}
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm h-10 px-4"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm h-10 px-4"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
