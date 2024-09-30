import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const token = (await getAccessToken()).accessToken;

    const urlParams = new URL(request.url).searchParams;
    const year = urlParams.get('year') || new Date().getFullYear();
    const month = urlParams.get('month') || new Date().getMonth() + 1;

    const apiUrl = `${process.env.SPRING_BOOT_URL}/days/office-days/${year}/${month}`;
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