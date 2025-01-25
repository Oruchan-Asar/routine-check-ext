import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session;

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const { todoId, completed } = await request.json();

    if (!todoId || typeof completed !== "boolean") {
      return new NextResponse("Invalid request body", { status: 400 });
    }

    const todo = await prisma.todo.findUnique({
      where: { id: todoId },
    });

    if (!todo) {
      return new NextResponse("Todo not found", { status: 404 });
    }

    if (todo.userId !== user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const today = new Date(new Date().setHours(0, 0, 0, 0));

    const todoStatus = await prisma.todoStatus.upsert({
      where: {
        todoId_date: {
          todoId,
          date: today,
        },
      },
      update: {
        completed,
      },
      create: {
        todoId,
        date: today,
        completed,
      },
    });

    return NextResponse.json(todoStatus);
  } catch (error) {
    console.error("Error updating todo status:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
