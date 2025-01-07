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

    const todos = await prisma.todo.findMany({
      where: { userId: user.id },
      include: {
        statuses: {
          where: {
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        },
      },
    });

    const transformedTodos = todos.map((todo) => ({
      id: todo.id,
      title: todo.title,
      completed: todo.statuses[0]?.completed ?? false,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    }));

    return NextResponse.json(transformedTodos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

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

    const { title } = await request.json();

    if (!title || typeof title !== "string" || title.trim() === "") {
      return new NextResponse("Title is required", { status: 400 });
    }

    const todo = await prisma.todo.create({
      data: {
        title: title.trim(),
        userId: user.id,
        statuses: {
          create: {
            date: new Date(new Date().setHours(0, 0, 0, 0)),
            completed: false,
          },
        },
      },
      include: {
        statuses: true,
      },
    });

    return NextResponse.json({
      id: todo.id,
      title: todo.title,
      completed: todo.statuses[0]?.completed ?? false,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    });
  } catch (error) {
    console.error("Error creating todo:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return new NextResponse(errorMessage, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const { title } = await request.json();
    const todoId = params.id;

    const todo = await prisma.todo.findUnique({
      where: { id: todoId },
    });

    if (!todo) {
      return new NextResponse("Todo not found", { status: 404 });
    }

    if (todo.userId !== user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data: {
        title,
      },
    });

    return NextResponse.json(updatedTodo);
  } catch (error) {
    console.error("Error updating todo:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const todoId = params.id;

    const todo = await prisma.todo.findUnique({
      where: { id: todoId },
    });

    if (!todo) {
      return new NextResponse("Todo not found", { status: 404 });
    }

    if (todo.userId !== user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.todo.delete({
      where: { id: todoId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
