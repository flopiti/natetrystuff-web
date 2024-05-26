import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const res = await fetch(`${process.env.CODE_HELPER_URL}/get-projects`, {
        headers: {
          'Content-Type': 'application/json',
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
    const body = await request.json()
    const res = await fetch(`${process.env.CODE_HELPER_URL}/get-projects`, {
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