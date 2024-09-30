import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";

function getFormattedDate(offsetDays) {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    return date.toISOString().split('T')[0];
}

export async function GET(request: NextRequest) {
    const token = (await getAccessToken()).accessToken;
    const startDate = getFormattedDate(-1); // Yesterday
    const endDate = getFormattedDate(30); // 30 days in the future
    const res = await fetch(`${process.env.SPRING_BOOT_URL}/meal-schedules?startDate=${startDate}&endDate=${endDate}`, {
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
    const token = (await getAccessToken()).accessToken;
    const body = await request.json()
    const res = await fetch(`${process.env.SPRING_BOOT_URL}/meal-schedules`, {
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