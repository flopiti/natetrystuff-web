import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
    try {
        console.log("Received POST request");
        const body = await request.json();
        console.log("Request body:", body);
        const openai = new OpenAI({
            apiKey: process.env.OPEN_AI_API_KEY
        });

        const chatCompletion = await openai.chat.completions.create({
            messages: body.messages,
            model: 'gpt-4',
            stream: false,
            response_format: { "type": "json_object" }
        });

        console.log("Chat completion response:", chatCompletion);
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
