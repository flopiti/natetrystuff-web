import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { id: number } }) {  
        const requestBody = await request.json();
        try {
        const response = await axios.post(`http://localhost:1234/create-new-resource/${params.id}`, {
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
        console.error('This resource already exists', 'error');
        return new NextResponse(JSON.stringify({ error: 'Resource already exists', details: request.body
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    console.error('This resource already exist');
    
}
export const config = {
    runtime: 'nodejs', // Switch back to a standard Node.js runtime to compare behavior
};