//DESC: This file handles GET requests to retrieve file names associated with a project from a Neo4j database.
import { NextRequest, NextResponse } from "next/server";
import neo4j from 'neo4j-driver';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const projectName = searchParams.get("projectName");

    if (!projectName) {
        return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'password'));
    const session = driver.session();

    try {
        const result = await session.run(
            'MATCH (p:Project {name: $projectName})-[:BELONGS_TO]-(f:File) RETURN f.name AS fileName',
            { projectName }
        );
        const files = result.records.map(record => record.get('fileName'));

        return NextResponse.json({ files });
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        await session.close();
        await driver.close();
    }
}