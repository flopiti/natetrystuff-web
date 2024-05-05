import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: number } }) {
    try {
        const response = await axios.get(`http://localhost:1234/create-new-resource/${params.id}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log('Response:', response.data);
    } catch (error) {
        console.error('This resource already exist');
    }
}
export const config = {
    runtime: 'nodejs', // Switch back to a standard Node.js runtime to compare behavior
};