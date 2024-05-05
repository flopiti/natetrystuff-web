import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const res = await fetch('http://localhost:8080/meal-schedules', {
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
    const res = await fetch('http://localhost:8080/meal-schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

// export const config = {
//     runtime: 'experimental-edge',
// };