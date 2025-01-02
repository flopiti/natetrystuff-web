//DESC: This file handles the GET request by fetching data from a specified URL and returning the response as JSON.
import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const project = searchParams.get('project'); 
    const branchName = searchParams.get('branchName');
    const commitMessage = searchParams.get('commitMessage');

    const res = await fetch(`${process.env.CODE_HELPER_URL}/send-it?project=${project}&branchName=${branchName}&commitMessage=${commitMessage}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
    });


    const resText = await res.text();
    console.log('Response:', resText); // Log the response as a string
    const data = JSON.parse(resText);

    return new NextResponse(JSON.stringify({ data }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}