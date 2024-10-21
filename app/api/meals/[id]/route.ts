//DESC: This file handles PUT and DELETE HTTP requests for meal updates and deletions.
import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextRequest } from 'next/dist/server/web/spec-extension/request';
import { NextResponse } from 'next/server';

export async function PUT(request: NextRequest, { params }: { params: { id: number } }) {
    try {
        const requestBody = await request.json();
        const mealId = params.id;
        const token = (await getAccessToken()).accessToken;
        const res = await fetch(`${process.env.SPRING_BOOT_URL}/meals/${mealId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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
export async function DELETE(request: NextRequest, { params }: { params: { id: number } }) {
    try {
        const token = (await getAccessToken()).accessToken;

        const res = await fetch(`${process.env.SPRING_BOOT_URL}/meals/${params.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
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
