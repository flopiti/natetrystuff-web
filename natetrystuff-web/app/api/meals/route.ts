import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    console.log('yo : ' + process.env.SPRING_BOOT_URL)
    const res = await fetch(`${process.env.SPRING_BOOT_URL}/meals`, {
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
    const res = await fetch(`${process.env.SPRING_BOOT_URL}/meals`, {
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

export async function DELETE(request: NextRequest) {
    const res = await fetch(`${process.env.SPRING_BOOT_URL}/meals/:id`, {
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