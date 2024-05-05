import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: number } }) {
    const res = await fetch(`http://localhost:1234/create-new-resource/${params.id}`, {
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
    })
}