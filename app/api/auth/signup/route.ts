import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface ExtensionTodo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export async function POST(request: Request) {
  try {
    const { email, password, name, extensionTodos } = await request.json();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // If extension todos exist, import them
    if (extensionTodos && Array.isArray(extensionTodos)) {
      const todosToCreate = extensionTodos.map((todo: ExtensionTodo) => ({
        title: todo.text,
        completed: todo.completed,
        dueDate: new Date(todo.createdAt),
        description: "",
        userId: user.id,
      }));

      await prisma.todo.createMany({
        data: todosToCreate,
      });
    }

    return NextResponse.json({ message: "User created successfully" });
  } catch (error: unknown) {
    console.error("Failed to create user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
