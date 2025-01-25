import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
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

    const todos = await prisma.routine.findMany({
      where: { userId: user.id },
      include: {
        statuses: {
          select: {
            date: true,
            completed: true,
          },
        },
      },
    });

    const transformedTodos = todos.map((todo) => ({
      id: todo.id,
      title: todo.title,
      statuses: todo.statuses.map((status) => ({
        date: status.date.toISOString().split("T")[0],
        completed: status.completed,
      })),
    }));

    return NextResponse.json(transformedTodos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
