import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session;
    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!start || !end) {
      return new NextResponse("Start and end dates are required", {
        status: 400,
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const routines = await prisma.routine.findMany({
      where: {
        userId: user.id,
      },
      include: {
        statuses: {
          where: {
            date: {
              gte: new Date(start),
              lte: new Date(end),
            },
          },
          select: {
            id: true,
            date: true,
            completed: true,
          },
        },
      },
    });

    const transformedRoutines = routines.map((routine) => ({
      id: routine.id,
      title: routine.title,
      statuses: routine.statuses.map((status) => ({
        id: status.id,
        date: status.date,
        completed: status.completed,
      })),
    }));

    return NextResponse.json(transformedRoutines);
  } catch (error) {
    console.error("Error fetching routines:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
