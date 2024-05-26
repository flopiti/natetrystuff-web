import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const res = await fetch(`${process.env.CODE_HELPER_URL}/spring-boot-classes`, {
        headers: {
          'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
        },

    });
    const data = await res.json();
    return new NextResponse(JSON.stringify({ data }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
        },
    });
}

export async function POST(request: NextRequest) {
    const body = await request.json()
    const res = await fetch(`${process.env.CODE_HELPER_URL}/spring-boot-classes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body.meal),
    });
    const data = await res.json();
    return new NextResponse(JSON.stringify({ data }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}