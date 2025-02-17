import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { LocalStorageRoutine } from "@/types/routines";
import { ZodError, z } from "zod";
import { prisma } from "@/lib/prisma";

// Input validation schema
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  extensionRoutines: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
        completed: z.boolean(),
        createdAt: z.string(),
      })
    )
    .optional(),
});

// Service layer functions
async function checkExistingUser(email: string) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }
}

async function createUser(email: string, password: string, name: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
}

async function importExtensionRoutines(
  userId: string,
  routines: LocalStorageRoutine[]
) {
  const routinesToCreate = routines.map((routine) => ({
    title: routine.text,
    userId,
    statuses: {
      create: {
        date: new Date(routine.createdAt),
        completed: routine.completed,
      },
    },
  }));

  for (const routineData of routinesToCreate) {
    await prisma.routine.create({
      data: routineData,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = signupSchema.parse(body);

    // Check for existing user
    await checkExistingUser(validatedData.email);

    // Create new user
    const user = await createUser(
      validatedData.email,
      validatedData.password,
      validatedData.name
    );

    // Import extension routines if they exist
    if (validatedData.extensionRoutines?.length) {
      await importExtensionRoutines(user.id, validatedData.extensionRoutines);
    }

    return NextResponse.json({
      message: "User created successfully",
      userId: user.id,
    });
  } catch (error: unknown) {
    console.error("Failed to create user:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      if (error.message === "Email already exists") {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
