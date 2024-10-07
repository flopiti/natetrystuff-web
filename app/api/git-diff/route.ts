import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const projectName = searchParams.get('projectName'); // Extract projectName from query params
    console.log('Project Name:', projectName); // Log the project name

    const res = await fetch(`${process.env.CODE_HELPER_URL}/git-diff/${projectName}`, {
        headers: {
          'Content-Type': 'application/json',
        },
    });

    const resText = await res.text();
    console.log('Response:', resText); // Log the response as a string
    const data = JSON.parse(resText);

    return new NextResponse(JSON.stringify({ data }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Surrogate-Control': 'no-store'
        },
    });
}