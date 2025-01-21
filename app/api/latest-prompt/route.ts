import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const token = (await getAccessToken()).accessToken;
  const promptText = await request.text(); // expecting plain text

  const res = await fetch(`${process.env.SPRING_BOOT_URL}/prompts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'Authorization': `Bearer ${token}`
    },
    body: promptText
  });

  const data = await res.json();
  return new NextResponse(JSON.stringify({ data }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function GET(request: NextRequest) {
    const token = (await getAccessToken()).accessToken;
    const res = await fetch(`${process.env.SPRING_BOOT_URL}/prompts/latest`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  
    const data = await res.json();
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }