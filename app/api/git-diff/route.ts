import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const projectName = searchParams.get('projectName'); // Extract projectName from query params

    const res = await fetch(`${process.env.CODE_HELPER_URL}/git-diff/${projectName}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
    });

    const resText = await res.text();
    const data = JSON.parse(resText);

    return new NextResponse(JSON.stringify({ data }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}