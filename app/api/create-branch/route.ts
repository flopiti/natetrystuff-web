//DESC: This file handles the creation of a new branch by making an API request to CODE_HELPER_URL using project and branchName query parameters.
import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const project = searchParams.get('project'); // Extract project from query params
    const branchName = searchParams.get('branchName'); // Extract branchName from query params
    console.log('Project:', project); // Log the project
    console.log('Branch Name:', branchName); // Log the branch name

    const res = await fetch(`${process.env.CODE_HELPER_URL}/create-branch?project=${project}&branchName=${branchName}`, {
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