import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { id: number } }) {
    const token = (await getAccessToken()).accessToken;
    const { id, taskId, completed } = await request.json();
    const res = await fetch(`${process.env.SPRING_BOOT_URL}/objectives/${params.id}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed }),
    });
    const data = await res.json();
    return new NextResponse(JSON.stringify({ data }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}