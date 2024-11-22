import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest,{ params }: { params: { id: number } }) {
    const token = (await getAccessToken()).accessToken;
    const res = await fetch(`${process.env.SPRING_BOOT_URL}/objectives/${params.id}/complete`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    return new NextResponse(null, {
        status: res.ok ? 200 : 404,
    });
}

export async function DELETE(request: NextRequest,{ params }: { params: { id: number } }) {
    const token = (await getAccessToken()).accessToken;
    const res = await fetch(`${process.env.SPRING_BOOT_URL}/objectives/${params.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    return new NextResponse(null, {
        status: res.ok ? 204 : 404,
    });
}
