import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const firstDate = searchParams.get('startDate');
    const lastDate = searchParams.get('endDate');
    // Obtain the access token required for authorization
    const token = (await getAccessToken()).accessToken;
    const res = await fetch(`${process.env.SPRING_BOOT_URL}/meal-schedules/get-groceries?startDate=${firstDate}&endDate=${lastDate}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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

export async function POST(request: NextRequest) {  
    // Get the access token and prepare for a POST request with a JSON body
    const token = (await getAccessToken()).accessToken;
    const body = await request.json()
    const res = await fetch(`${process.env.SPRING_BOOT_URL}/meals-schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
    });

    const data = await res.json();
    return new NextResponse(JSON.stringify({ data }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}