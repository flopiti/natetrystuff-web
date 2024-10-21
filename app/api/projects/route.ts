//DESC: This file handles the retrieval of project names from a Neo4j database and returns them as a JSON response.
import { NextRequest, NextResponse } from "next/server";
import neo4j from 'neo4j-driver';

export async function GET(request: NextRequest) {
    const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'password'));
    const session = driver.session();

    try {
        const result = await session.run('MATCH (p:Project) RETURN p.name AS name');
        const projects = result.records.map(record => record.get('name'));

        return NextResponse.json({ projects });
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        await session.close();
        await driver.close();
    }
}