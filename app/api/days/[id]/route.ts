//DESC: This file handles updates to day data for a specific ID using a PUT request and Auth0 authentication.
import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { id: number } }) {
    const token = (await getAccessToken()).accessToken;
    const body = await request.json();
    // Fetching the day data from the server
    const res = await fetch(`${process.env.SPRING_BOOT_URL}/days/${params.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    return new NextResponse(JSON.stringify({ data }), {
        status: res.status,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}