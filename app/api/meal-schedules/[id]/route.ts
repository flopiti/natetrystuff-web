//DESC: This file defines the DELETE and PUT HTTP methods to manage meal schedules via a Next.js API route.
import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: { id: number } }) {
    const token = (await getAccessToken()).accessToken;
    const res = await fetch(`${process.env.SPRING_BOOT_URL}/meal-schedules/${params.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await res.json();
    return new NextResponse(JSON.stringify({ data }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export async function PUT(request: NextRequest, { params }: { params: { id: number } }) {
    const token = (await getAccessToken()).accessToken;
    const body = await request.json();
    const res = await fetch(`${process.env.SPRING_BOOT_URL}/meal-schedules/${params.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    return new NextResponse(JSON.stringify({ data }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
