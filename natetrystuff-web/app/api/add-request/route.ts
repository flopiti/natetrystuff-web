import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const baseURL = process.env.NODE_ENV === 'production' ? process.env.CODE_HELPER_URL : 'http://your-production-url.com';
    console.log(baseURL); // For debugging, remove in production
    const res = await fetch(`${baseURL}/add-request`, {
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