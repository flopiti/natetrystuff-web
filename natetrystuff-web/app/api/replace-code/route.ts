import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {  
    const requestBody = await request.json();
    try {
        console.log(requestBody)
    const response = await axios.post(`${process.env.CODE_HELPER_URL}/replace-code`, {
        headers: {
            'Content-Type': 'application/json',
        },
        data: requestBody
    });
    return new NextResponse(JSON.stringify({ message: 'Resource created', data: response.data }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
} catch (error) {
    console.log(error)
    console.error('This resource already exists', 'error');
    return new NextResponse(JSON.stringify({ error: 'Resource already exists', details: request.body
    }), {
        status: 400,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
}