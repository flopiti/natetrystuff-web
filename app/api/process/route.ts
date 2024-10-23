//DESC: This file handles POST and GET requests to interact with the '/process' endpoint in a Spring Boot application.
import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const token = (await getAccessToken()).accessToken;
    const body = await request.json();
    const res = await fetch(`${process.env.SPRING_BOOT_URL}/process`, {
        method: 'POST',
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

export async function GET(request: NextRequest) {
    const token = (await getAccessToken()).accessToken;
    const apiUrl = `${process.env.SPRING_BOOT_URL}/processes`;
    const res = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await res.json();
    return new NextResponse(JSON.stringify({ data }), {
        status: res.status,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}