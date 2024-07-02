import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const res = await fetch(`${process.env.CODE_HELPER_URL}/get-projects`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();

    return new NextResponse(JSON.stringify({ data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error:any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
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