
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const destinations = await prisma.destination.findMany({
            where: {
                isPublished: true,
             },
            select: {
                id: true,
                name: true,
                slug: true,
            },
            orderBy: {
                name: "asc",
            },
        });

        return NextResponse.json({
            destinations,
        });
    } catch (error) {
        console.error(
            "Failed to fetch parent destinations:",
            error
        );

        return NextResponse.json(
            {
                message: "Failed to fetch parent destinations",
            },
            {
                status: 500,
            }
        );
    }
}
