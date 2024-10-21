//DESC: This file handles HTTP GET, POST, and DELETE requests to interact with project paths using a Spring Boot API.
import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const token = (await getAccessToken()).accessToken;
    const response = await fetch(`${process.env.SPRING_BOOT_URL}/project-paths`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = await response.json();
    return new NextResponse(JSON.stringify({ data }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export async function POST(request: NextRequest) {
    const token = (await getAccessToken()).accessToken;
    const body = await request.json();
    const response = await fetch(`${process.env.SPRING_BOOT_URL}/project-paths`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });
    const data = await response.json();
    return new NextResponse(JSON.stringify({ data }), {
        status: 201,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export async function DELETE(request: NextRequest) {
    const token = (await getAccessToken()).accessToken;
    const { path } = await request.json(); // Assuming path is sent in the request body
    const response = await fetch(`${process.env.SPRING_BOOT_URL}/project-paths`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ path }),
    });
    if (response.ok) {
        return new NextResponse(null, {
            status: 204,
        });
    } else {
        const data = await response.json();
        return new NextResponse(JSON.stringify({ data }), {
            status: 500,
        });
    }
}
