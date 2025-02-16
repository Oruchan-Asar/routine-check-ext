import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
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
    const { id: routineId } = await context.params;

    const routine = await prisma.routine.findUnique({
      where: { id: routineId },
    });

    if (!routine) {
      return new NextResponse("Routine not found", { status: 404 });
    }

    if (routine.userId !== user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const today = new Date(new Date().setHours(0, 0, 0, 0));

    const routineStatus = await prisma.routineStatus.upsert({
      where: {
        routineId_date: {
          routineId,
          date: today,
        },
      },
      update: {
        completed,
      },
      create: {
        routineId,
        date: today,
        completed,
      },
    });

    return NextResponse.json({
      ...routine,
      completed: routineStatus.completed,
    });
  } catch (error) {
    console.error("Error updating routine:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
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

    const { title, url } = await request.json();
    const { id: routineId } = await context.params;

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
        url: url?.trim(),
      },
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

    return NextResponse.json({
      id: updatedRoutine.id,
      title: updatedRoutine.title,
      url: updatedRoutine.url,
      completed: updatedRoutine.statuses[0]?.completed ?? false,
      createdAt: updatedRoutine.createdAt,
      updatedAt: updatedRoutine.updatedAt,
    });
  } catch (error) {
    console.error("Error updating routine:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
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

    const { id: routineId } = await context.params;

    const routine = await prisma.routine.findUnique({
      where: { id: routineId },
    });

    if (!routine) {
      return new NextResponse("Routine not found", { status: 404 });
    }

    if (routine.userId !== user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Delete related RoutineStatus records first
    await prisma.routineStatus.deleteMany({
      where: { routineId },
    });

    // Then delete the Routine
    await prisma.routine.delete({
      where: { id: routineId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting routine:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
