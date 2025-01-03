import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userEmail = request.headers.get("x-user-email");

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const todos = await prisma.todo.findMany({
      where: {
        user: {
          email: userEmail,
        },
      },
      select: {
        id: true,
        title: true,
        completed: true,
        dueDate: true,
      },
    });

    return NextResponse.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}
