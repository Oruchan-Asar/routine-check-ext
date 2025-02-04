"use client";

import {
  FaCheckCircle,
  FaCalendarAlt,
  FaChrome,
  FaSyncAlt,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}

export default function MainContent() {
  const router = useRouter();

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Routine Check Extension 📝
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Manage your daily routines and sync them with your calendar
            seamlessly
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full mt-8">
          <FeatureCard
            icon={<FaCheckCircle className="w-8 h-8" />}
            title="Routine Management"
            description="Create and manage daily routines with ease"
            onClick={() => router.push("/routines")}
          />
          <FeatureCard
            icon={<FaCalendarAlt className="w-8 h-8" />}
            title="Calendar Integration"
            description="Track missed routines and stay organized"
            onClick={() => router.push("/calendar")}
          />
          <FeatureCard
            icon={<FaChrome className="w-8 h-8" />}
            title="Quick Access"
            description="Chrome extension popup for instant routine management"
          />
          <FeatureCard
            icon={<FaSyncAlt className="w-8 h-8" />}
            title="Auto Sync"
            description="Persistent storage keeps your routines safe"
          />
        </div>

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
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description, onClick }: FeatureCardProps) {
  return (
    <Card
      className="hover:border-gray-300 dark:hover:border-gray-700 transition-all cursor-pointer"
      onClick={onClick}
    >
      <CardHeader>
        <div className="text-primary mb-2">{icon}</div>
        <CardTitle className="mb-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
