import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as Session;

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    return new NextResponse("Authenticated", { status: 200 });
  } catch (error) {
    console.error("Error checking auth status:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
