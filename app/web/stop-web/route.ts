// DESC: This file stops the web service by making an API request to CODE_HELPER_URL.
import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const res = await fetch(`${process.env.CODE_HELPER_URL}/stop-web`, {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
    });

    const resText = await res.text();
    console.log('Response:', resText); // Log the response as a string
    const data = JSON.parse(resText);

    return new NextResponse(JSON.stringify({ data }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}