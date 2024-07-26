import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
    const body = await request.json()
    const openai = new OpenAI({
        apiKey: process.env.OPEN_AI_API_KEY
      });
      console.log('sending:', body.messages)
    const chatCompletion = await openai.chat.completions.create({
        messages: body.messages ,
        model: 'gpt-4-1106-preview',
        response_format:{ "type": "json_object" },
      });
    console.log('response:', chatCompletion.choices[0].message.content)

    return new NextResponse(JSON.stringify({ chatCompletion }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}