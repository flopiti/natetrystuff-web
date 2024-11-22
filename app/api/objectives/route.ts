import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const token = (await getAccessToken()).accessToken;
    const response = await fetch(`${process.env.SPRING_BOOT_URL}/objectives/lowest-id`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
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
    const res = await fetch(`${process.env.SPRING_BOOT_URL}/objectives`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body.objective),
    });
    const data = await res.json();
    return new NextResponse(JSON.stringify({ data }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export async function PUT(request: NextRequest) {
    const token = (await getAccessToken()).accessToken;
    const { id } = request.params;
    const res = await fetch(`${process.env.SPRING_BOOT_URL}/objectives/${id}/complete`, {
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

export async function DELETE(request: NextRequest) {
    const token = (await getAccessToken()).accessToken;
    const { id } = request.params;
    const res = await fetch(`${process.env.SPRING_BOOT_URL}/objectives/${id}`, {
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
