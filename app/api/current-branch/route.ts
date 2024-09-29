import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dirPath = searchParams.get("dirPath");
    console.log('getting branch')
    console.log(`${process.env.CODE_HELPER_URL}/current-branch?dirPath=${dirPath}`)
    const res = await fetch(`${process.env.CODE_HELPER_URL}/current-branch?dirPath=${dirPath}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });


    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();

    console.log('data', data)
    return new NextResponse(JSON.stringify({ data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error:any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}