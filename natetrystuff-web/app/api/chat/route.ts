import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
    const body = await request.json()
    const openai = new OpenAI({
        apiKey: process.env.OPEN_AI_API_KEY
      });
    const chatCompletion = await openai.chat.completions.create({
        messages: body.messages ,
        model: 'gpt-4-turbo',
        response_format:{ "type": "json_object" },
      });

    return new NextResponse(JSON.stringify({ chatCompletion }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}