//DESC: Handles POST requests to interact with the OpenAI chat completion API without streaming.
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const openai = new OpenAI({
            apiKey: process.env.OPEN_AI_API_KEY
        });

        const chatCompletion = await openai.chat.completions.create({
            messages: body.messages,
            model: 'gpt-4o',
            stream: false,
            response_format: { "type": "json_object" }
        });

        const text = chatCompletion.choices[0].message.content;

        return new NextResponse(text, {
            status: 200,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    } catch (error) {
        console.error("Error handling request:", error);
        return new NextResponse("Internal Server Error", {
            status: 500,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }
}
