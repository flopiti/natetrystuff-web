import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from "openai";

export async function POST(request: NextRequest) {
    const req = await request.json();
    const openai = new OpenAI({
        apiKey: process.env.OPEN_AI_API_KEY
    });
    const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: `Please give me a FILE DESCRIPTION of the file required to implement the following feature or bugfix: ${req.featbugDescription}`,
        encoding_format: "float",
    });

    const pc = new Pinecone({
        apiKey: '24353792-dce7-4d9b-820f-9d30202e3669'
    });
    const index = pc.index('codebase');

    try {
        const queryResult = await index.namespace('ns1').query({
            topK: 1,
            vector: embedding.data[0].embedding,
            includeMetadata: true
        });

        return new NextResponse(JSON.stringify( queryResult), {
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