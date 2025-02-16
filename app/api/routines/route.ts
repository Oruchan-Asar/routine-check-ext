import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    // Get today's date at midnight UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const routines = await prisma.routine.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        title: true,
        url: true,
        createdAt: true,
        updatedAt: true,
        statuses: {
          where: {
            date: today,
          },
        },
      },
    });

    const transformedRoutines = routines.map((routine) => ({
      id: routine.id,
      title: routine.title,
      url: routine.url,
      completed: routine.statuses[0]?.completed ?? false,
      createdAt: routine.createdAt,
      updatedAt: routine.updatedAt,
    }));

    return NextResponse.json(transformedRoutines);
  } catch (error) {
    console.error("Error fetching routines:", error);
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

    const { title, url } = await request.json();

    if (!title || typeof title !== "string" || title.trim() === "") {
      return new NextResponse("Title is required", { status: 400 });
    }

    const routine = await prisma.routine.create({
      data: {
        title: title.trim(),
        url: url?.trim(),
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
      id: routine.id,
      title: routine.title,
      url: routine.url,
      completed: routine.statuses[0]?.completed ?? false,
      createdAt: routine.createdAt,
      updatedAt: routine.updatedAt,
    });
  } catch (error) {
    console.error("Error creating routine:", error);
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
    const routineId = params.id;

    const routine = await prisma.routine.findUnique({
      where: { id: routineId },
    });

    if (!routine) {
      return new NextResponse("Routine not found", { status: 404 });
    }

    if (routine.userId !== user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedRoutine = await prisma.routine.update({
      where: { id: routineId },
      data: {
        title,
      },
    });

    return NextResponse.json(updatedRoutine);
  } catch (error) {
    console.error("Error updating routine:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
