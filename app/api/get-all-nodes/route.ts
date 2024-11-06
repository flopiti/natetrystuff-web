//DESC: This file handles GET requests to retrieve all entries from the Pinecone index.

import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';

export async function GET(request: NextRequest) {
    const pc = new Pinecone({
        apiKey: '24353792-dce7-4d9b-820f-9d30202e3669'
    });
    const index = pc.index('codebase');

    try {
        const data = await index.namespace('ns1').query({
            topK: 1000, // or another number that makes sense for retrieving all entries
            includeMetadata: true
        });
        console.log('Retrieved vectors successfully');

        return new NextResponse(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error retrieving vectors:', error);
        return new NextResponse(JSON.stringify({ error: 'Error retrieving vectors' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
