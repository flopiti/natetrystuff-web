//DESC: This file handles POST requests to embed data in Pinecone index.

import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from "openai";


export async function POST(request: NextRequest) {
    const x = await request.json();
    console.log('x it')
    console.log(x)
    // console.log(vectors)
    // console.log(selectedFileName)
    // console.log(selectedFileContent)


    const openai = new OpenAI({
        apiKey: process.env.OPEN_AI_API_KEY
    });
    const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: x.toEmbed,
        encoding_format: "float",
      });

      console.log('embedding')
      console.log(embedding.data[0].embedding)

      console.log(embedding.data.map((value: any) => parseFloat(value)))

    const pc = new Pinecone({
        apiKey: ''
    });
    const index = pc.index('codebase');

    console.log(embedding.data.map((value: any) => parseFloat(value)))
    try {
        await index.namespace('ns1').upsert([
            {
                id: x.id, // Assuming x has an id property
                values: embedding.data[0].embedding
            }
        ]);
    } catch (error) {
        console.error('Error upserting vectors:', error);
        throw error;
    }
    ;

    try {
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