import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: { id: number } }) {
    try {
        const res = await fetch(`${process.env.SPRING_BOOT_URL}/meals/${params.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error('Failed to delete');
        }

        const text = await res.text();
        const data = text ? JSON.parse(text) : {};
        return new NextResponse(data, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error:any) {
        console.error(error);
        return new NextResponse(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

    


// export const config = {
//     runtime: 'experimental-edge',
// };
