//DESC: This file handles POST requests to embed data in Pinecone index.

import { NextRequest, NextResponse } from 'next/server';

const pc = new Pinecone({ apiKey: '24353792-dce7-4d9b-820f-9d30202e3669' });
const index = pc.index('quickstart');

export async function POST(request: NextRequest) {
    const { vectors } = await request.json();
    try {
        await index.namespace('ns1').upsert(vectors);
        return new NextResponse(JSON.stringify({ message: 'Vectors upserted successfully' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error upserting vectors:', error);
        return new NextResponse(JSON.stringify({ error: 'Error upserting vectors' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}