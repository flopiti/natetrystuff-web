import CodeAnalyzer from "@/app/codeAnalyzer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const analyzer = new CodeAnalyzer("bolt://localhost:7687", "neo4j", "password");

    const projectNames = [
        'code-helper',
        'natetrystuff-api',
        'natetrystuff-web'
    ];

    // Analyze the code in the specified project directories
    await analyzer.analyzeProjects(projectNames);

    // Close the connection
    await analyzer.close();

    return new NextResponse(JSON.stringify({ message: 'Analysis complete' }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
