// /app/routes/api/meals.tsx

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    console.log('API Route Called: /api/yo');
    const res = await fetch('http://localhost:8080/meals', {
        headers: {
          'Content-Type': 'application/json',
        },
    });

    console.log(res)

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
    const res = await fetch('http://localhost:8080/meals', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    return new NextResponse(JSON.stringify({ data }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export async function DELETE(request: NextRequest) {

    //get id from the path

    const res = await fetch('http://localhost:8080/meals/:id', {
        method: 'DELETE',
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


// export const config = {
//     runtime: 'experimental-edge',
// };
