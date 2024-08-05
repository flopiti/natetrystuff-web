import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
        const requestBody = await request.json();
        try {
            console.log('requestBody', requestBody)
        const response = await axios.post(`${process.env.CODE_HELPER_URL}/has-many`, {
            headers: {
                'Content-Type': 'application/json',

            },
            data: requestBody
        });
        return new NextResponse(JSON.stringify(response.data), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        }      catch (error:any) {
            console.log('Error in Axios request:', error.response ? error.response.data : error.message); // Log detailed error from Axios
            // Return a detailed error response back to the client
            return new NextResponse(JSON.stringify({
                error: 'Resource creation failed',
                details: error.response ? error.response.data : 'No additional error information'
            }), {
                status: error.response ? error.response.status : 500, // Use actual status from Axios error or 500 if unavailable
                headers: {
                    'Content-Type': 'application/json'
                }
            });

    }
}