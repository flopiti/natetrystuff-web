import CodeAnalyzer from "@/app/codeAnalyzer";
import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');
    const project = searchParams.get('project');
    const res = await fetch(`${process.env.CODE_HELPER_URL}/get-file?fileName=${fileName}&project=${project}`, {
        headers: {
          'Content-Type': 'application/json',
        },
    });

    const data = await res.json();

    const fullFile = JSON.stringify({fileName: fileName, code: data});

    const openai = new OpenAI({
        apiKey: process.env.OPEN_AI_API_KEY
      });
    const chatData:any = await openai.chat.completions.create({
        messages: [{
            role: 'user', content: `Please split the file into the following structure and return a JSON that can be fully parsed with JSON.parse(): { file: 'fileName', functions: [{ functionName: 'name', code }], classes: [{ className: 'name', code }] }\n Content: ${fullFile}`
        }] ,
        model: 'gpt-4o',
        response_format:{ "type": "json_object" },
      });
    // Split the file using ChatGPT and parse into JSON
    // console.log('allo')
    // console.log(chatData.choices[0].message)

    const splitFileData = chatData.choices[0].message;

    const analyzer = new CodeAnalyzer("bolt://localhost:7687", "neo4j", "password");

    // Analyze the code in your project directory and store the purpose
    await analyzer.analyzeCode("/Users/nathanpieraut/projects/natetrystuff-web", "Describe the purpose of the project here");

    // Close the connection
    await analyzer.close();

    return new NextResponse(JSON.stringify({ data, splitFileData }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export async function POST(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');
    const project = searchParams.get('project');
    const res = await fetch(`${process.env.CODE_HELPER_URL}/get-file?fileName=${fileName}&project=${project}`, {
        headers: {
          'Content-Type': 'application/json',
        },
    });

    const data = await res.json();
    
    // Split the file using ChatGPT and parse into JSON
    const chatRes = await fetch(`${process.env.CODE_HELPER_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messages: [{
                role: 'user', content: `Please split the file into the following structure: { file: file1.xy, functions: [{ functionName: 'name', code }], classes: [{ className: 'name', code }] }\n Content: ${data}`
            }]
        })
    });

    const chatData = await chatRes.json();
    const splitFileData = chatData.chatCompletion.choices[0].message;

    return new NextResponse(JSON.stringify({ data, splitFileData }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
