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

    const pc = new Pinecone({
        apiKey: '24353792-dce7-4d9b-820f-9d30202e3669'
    });
    const index = pc.index('codebase');

    try {
        await index.namespace('ns1').upsert([
            {
                id: x.id,
                values: embedding.data[0].embedding,
                metadata: {
                    fileName: x.fileName,
                    projectName: x.projectName
                }
            }
        ]);
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