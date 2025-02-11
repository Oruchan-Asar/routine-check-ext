"use client";

import {
  FaCheckCircle,
  FaCalendarAlt,
  FaChrome,
  FaSyncAlt,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FeatureCard } from "./FeatureCard";

const FEATURES = [
  {
    icon: <FaCheckCircle className="w-8 h-8" />,
    title: "Routine Management",
    description: "Create and manage daily routines with ease",
    path: "/routines",
  },
  {
    icon: <FaCalendarAlt className="w-8 h-8" />,
    title: "Calendar Integration",
    description: "Track missed routines and stay organized",
    path: "/calendar",
  },
  {
    icon: <FaChrome className="w-8 h-8" />,
    title: "Quick Access",
    description: "Chrome extension popup for instant routine management",
    path: "https://chromewebstore.google.com/detail/routine-check-extension/gopdccjgnngjmbgacpgldpcpchlacgdl",
  },
  {
    icon: <FaSyncAlt className="w-8 h-8" />,
    title: "Auto Sync",
    description: "Persistent storage keeps your routines safe",
  },
];

function Header() {
  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl font-bold mb-4">Routine Check Extension 📝</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        Manage your daily routines and sync them with your calendar seamlessly
      </p>
    </header>
  );
}

function ActionButtons() {
  return (
    <div className="flex gap-4 items-center flex-col sm:flex-row mt-8">
      <Link
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        href="https://chromewebstore.google.com/detail/routine-check-extension/gopdccjgnngjmbgacpgldpcpchlacgdl"
        target="_blank"
        rel="noopener noreferrer"
      >
        Install Extension
      </Link>
      <Link
        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        href="https://github.com/Oruchan-Asar/routine-check-ext"
        target="_blank"
        rel="noopener noreferrer"
      >
        View on GitHub
      </Link>
    </div>
  );
}

export default function MainContent() {
  const router = useRouter();

  return (
    <section className="p-8 mt-28 sm:mb-0 mb-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <Header />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full mt-8">
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              onClick={
                feature.path ? () => router.push(feature.path) : undefined
              }
            />
          ))}
        </div>

        <ActionButtons />
      </main>
    </section>
  );
}
