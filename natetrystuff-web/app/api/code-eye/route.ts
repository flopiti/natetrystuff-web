import CodeAnalyzer from "@/app/codeAnalyzer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const analyzer = new CodeAnalyzer("bolt://localhost:7687", "neo4j", "password");

    // Analyze the code in your project directory and store the purpose
    await analyzer.analyzeCode("/Users/nathanpieraut/projects/code-helper");

    // Close the connection
    await analyzer.close();

    return new NextResponse(JSON.stringify({ message: 'Analysis complete' }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
