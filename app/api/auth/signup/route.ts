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

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

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

    // If extension todos exist, import them as routines
    if (extensionTodos && Array.isArray(extensionTodos)) {
      const routinesToCreate = extensionTodos.map((todo: ExtensionTodo) => ({
        title: todo.text,
        userId: user.id,
        statuses: {
          create: {
            date: new Date(todo.createdAt),
            completed: todo.completed,
          },
        },
      }));

      // Create routines with their initial status
      for (const routineData of routinesToCreate) {
        await prisma.routine.create({
          data: routineData,
        });
      }
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
