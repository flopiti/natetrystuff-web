import { NextRequest } from 'next/dist/server/web/spec-extension/request';
import { NextResponse } from 'next/server';

export async function PUT(request: NextRequest, { params }: { params: { id: number } }) {
    try {
        const requestBody = await request.json();
        const mealId = params.id;
        console.log(requestBody)
        const res = await fetch(`${process.env.SPRING_BOOT_URL}/meals/${mealId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!res.ok) {
            throw new Error('Failed to update');
        }

        const data = await res.json();
        return new NextResponse(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error: any) {
        console.error(error);
        return new NextResponse(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

// You can also add config if necessary
// export const config = {
//     runtime: 'experimental-edge',
// };