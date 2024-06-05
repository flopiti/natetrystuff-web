import { Driver, Session, driver, auth } from "neo4j-driver";
import path from "path";
import { Project, SyntaxKind } from "ts-morph";

class CodeAnalyzer {
    private driver: Driver;

    constructor(uri: string, user: string, password: string) {
        console.log('building')
        this.driver = driver(uri, auth.basic('neo4j', 'password'));
    }

    async close() {
        await this.driver.close();
    }

    async createProjectNode(session: Session, projectName: string) {
        await session.run(
            "MERGE (p:Project {name: $projectName})",
            { projectName }
        );
        console.log("Created or found project node")
    }

    async createFileNode(session: Session, fileName: string, projectName: string) {
        await session.run(
            "MATCH (p:Project {name: $projectName}) "+
            "MERGE (f:File {name: $fileName})-[:BELONGS_TO]->(p)",
            { fileName, projectName }
        );
        console.log("Created or found file node")
    }

    async createFunctionNode(session: Session, functionName: string, fileName: string) {
        await session.run(
            "MATCH (f:File {name: $fileName}) " +
            "MERGE (func:Function {name: $functionName})-[:DEFINED_IN]->(f)",
            { fileName, functionName }
        );
    }

    async analyzeProjects(projectNames: string[]) {
        for (const projectName of projectNames) {
            console.log('doing project '  + projectName)
            const projectPath = path.join('/Users/nathanpieraut/projects/', projectName);
            const project = new Project();
            
            const session = this.driver.session();
            await this.createProjectNode(session, projectName);
            await session.close();
            
            project.addSourceFilesAtPaths(path.join(projectPath, "**/*.ts"));
            const sourceFiles = project.getSourceFiles().filter(sf => !sf.getFilePath().includes("node_modules"));
            console.log('source files: ' + sourceFiles.map(sf => sf.getFilePath()));
            for (const sourceFile of sourceFiles) {
                const filePath = sourceFile.getFilePath();
                const fileSession = this.driver.session();
                await this.createFileNode(fileSession, filePath, projectName);

                for (const func of sourceFile.getFunctions()) {
                    const funcSession = this.driver.session();
                    await this.createFunctionNode(funcSession, func.getName() || "", filePath);
                    await funcSession.close();
                }
                await fileSession.close();
            }
        }
    }
}

export default CodeAnalyzer;
