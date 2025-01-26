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

    const { routineId, completed } = await request.json();

    if (!routineId || typeof completed !== "boolean") {
      return new NextResponse("Invalid request body", { status: 400 });
    }

    const routine = await prisma.routine.findUnique({
      where: { id: routineId },
    });

    if (!routine) {
      return new NextResponse("Routine not found", { status: 404 });
    }

    if (routine.userId !== user.id) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const today = new Date().toISOString().split("T")[0];

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

    return NextResponse.json(routineStatus);
  } catch (error) {
    console.error("Error updating routine status:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
