//DESC: This file handles GET requests to retrieve all entries from the Pinecone index.
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';

export async function GET(request: NextRequest) {
    console.log("THIS IS THE NEXT SERVER TO GET ALL NODES")
    const pc = new Pinecone({
        apiKey: '24353792-dce7-4d9b-820f-9d30202e3669'
    });
    const index = pc.index('codebase');
    try {
        const data = await index.namespace('ns1').query({
            topK: 1000,
            includeMetadata: true,
            vector: Array.from({ length: 1536 }, () => Math.random()), // Generating a random 1536-dimensional vector
        });
        console.log('Retrieved vectors successfully');

        // Ensure no caching by setting appropriate headers
        return new NextResponse(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Surrogate-Control': 'no-store'
            }
        });
    } catch (error) {
        console.error('Error retrieving vectors:', error);
        return new NextResponse(JSON.stringify({ error: 'Error retrieving vectors' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Surrogate-Control': 'no-store'
            }
        });
    }
}
