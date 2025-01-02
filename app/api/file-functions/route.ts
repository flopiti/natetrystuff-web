//DESC: This file defines a Next.js API route that retrieves function names defined in a specified file using a Neo4j database.
import { NextRequest, NextResponse } from "next/server";
import neo4j from 'neo4j-driver';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("fileName");

    if (!fileName) {
        return NextResponse.json({ error: "File name is required" }, { status: 400 });
    }

    const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'password'));
    const session = driver.session();
        
    try {
        const result = await session.run(
            'MATCH (f:File {name: $fileName})-[:DEFINED_IN]-(func:Function) RETURN func.name AS functionName',
            { fileName }
        );
        const functions = result.records.map(record => record.get('functionName'));

        return NextResponse.json({ functions });
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        await session.close();
        await driver.close();
    }
}