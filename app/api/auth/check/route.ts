import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as Session;

    if (session) {
      return NextResponse.json({ authenticated: true, user: session.user });
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
