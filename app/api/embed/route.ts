//DESC: This file handles POST and GET requests to interact with Pinecone index.

import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from "openai";

export async function POST(request: NextRequest) {
    const x = await request.json();
    const openai = new OpenAI({
        apiKey: process.env.OPEN_AI_API_KEY
    });
    const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: x.toEmbed,
        encoding_format: "float",
    });

    console.log('embedding');
    console.log(embedding.data[0].embedding);

    const pc = new Pinecone({
        apiKey: '24353792-dce7-4d9b-820f-9d30202e3669'
    });
    const index = pc.index('codebase');

    try {
        await index.namespace('ns1').upsert([
            {
                id: x.id, // Assuming x has an id property
                values: embedding.data[0].embedding
            }
        ]);
        console.log('Vectors upserted successfully');

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

export async function GET(request: NextRequest) {
    const openai = new OpenAI({
        apiKey: process.env.OPEN_AI_API_KEY
    });
    const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: 'Find me file to change the office-day stuff',
        encoding_format: "float",
    });

    console.log('embedding');
    console.log(embedding.data[0].embedding);

    const pc = new Pinecone({
        apiKey: '24353792-dce7-4d9b-820f-9d30202e3669'
    });
    const index = pc.index('codebase');

    try {
        const queryResult = await index.namespace('ns1').query({
            topK: 1, // Example parameter, adjust as needed
            vector: embedding.data[0].embedding,
            includeMetadata: true
        });
        console.log('Query result:', queryResult);

        return new NextResponse(JSON.stringify({ queryResult }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error querying vectors:', error);
        return new NextResponse(JSON.stringify({ error: 'Error querying vectors' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}