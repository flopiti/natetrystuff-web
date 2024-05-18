import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const res = await fetch(`${process.env.CODE_HELPER_URL}/add-request`, {
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