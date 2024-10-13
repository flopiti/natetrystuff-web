//DESC: This file handles the API request to fetch office days for a specific year and month using Auth0 authentication.
import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const token = (await getAccessToken()).accessToken;
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const month = searchParams.get('month');

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