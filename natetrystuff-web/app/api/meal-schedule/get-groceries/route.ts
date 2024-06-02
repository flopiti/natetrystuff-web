import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const firstDate = searchParams.get('startDate');
    const lastDate = searchParams.get('endDate');

    const res = await fetch(`${process.env.SPRING_BOOT_URL}/meal-schedules/get-groceries?startDate=${firstDate}&endDate=${lastDate}`, {
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
    const res = await fetch(`${process.env.SPRING_BOOT_URL}/meals-schedule`, {
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