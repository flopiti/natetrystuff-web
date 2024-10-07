import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const openai = new OpenAI({
        apiKey: process.env.OPEN_AI_API_KEY
    });

    const stream = new ReadableStream({
        async start(controller) {
            const chatCompletion = await openai.chat.completions.create({
                messages: body.messages,
                model: 'gpt-4', // changed from 'gpt-4o' to 'gpt-4'
                stream: true,// enable streaming
                response_format: { "type": "json_object" },
            });

            for await (const chunk of chatCompletion) {
                const text = chunk.choices[0].delta.content;
                if (text) {
                    controller.enqueue(new TextEncoder().encode(text));
                }
            }
            controller.close();
        }
    });

    return new NextResponse(stream, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}