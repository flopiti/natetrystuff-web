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

export const config = {
    runtime: 'experimental-edge',
};
