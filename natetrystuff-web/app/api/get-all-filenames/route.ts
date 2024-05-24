import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const project = searchParams.get('project');
    console.log(project)
    const res = await fetch(`${process.env.CODE_HELPER_URL}/get-all-filenames?project=${project}`, {
        headers: {
          'Content-Type': 'application/json',
        },
    });

    const data = await res.json();
    return new NextResponse(JSON.stringify({ data }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export async function POST(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const project = searchParams.get('project');
    const res = await fetch(`${process.env.CODE_HELPER_URL}/get-all-filenames?project=${project}`, {
        headers: {
          'Content-Type': 'application/json',
        },
    });

    const data = await res.json();
    return new NextResponse(JSON.stringify({ data }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

