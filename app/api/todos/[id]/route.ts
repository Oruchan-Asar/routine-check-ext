import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
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

    const { completed } = await request.json();
    const { id: todoId } = await context.params;

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

    return NextResponse.json({ ...todo, completed: todoStatus.completed });
  } catch (error) {
    console.error("Error updating todo:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
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
    const { id: todoId } = await context.params;

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
  context: { params: { id: string } }
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

    const { id: todoId } = await context.params;

    const todo = await prisma.todo.findUnique({
      where: { id: todoId },
    });

    if (!todo) {
      return new NextResponse("Todo not found", { status: 404 });
    }

    if (todo.userId !== user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Delete related TodoStatus records first
    await prisma.todoStatus.deleteMany({
      where: { todoId },
    });

    // Then delete the Todo
    await prisma.todo.delete({
      where: { id: todoId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
