import { Driver, Session, driver, auth } from "neo4j-driver";
import path from "path";
import { Project, SyntaxKind } from "ts-morph";


class CodeAnalyzer {
    private driver: Driver;
    private session: Session;

    constructor(uri: string, user: string, password: string) {
        console.log('building')
        this.driver = driver(uri, auth.basic('neo4j', 'password'));
        
        this.session = this.driver.session();
    }

    async close() {
        await this.session.close();
        await this.driver.close();
    }

    async createProjectNode(projectName: string) {
        await this.session.run(
            "MERGE (p:Project {name: $projectName})",
            { projectName }
        );
        console.log("Created or found project node")
    }

    async createFileNode(fileName: string, projectName: string) {
        await this.session.run(
            "MATCH (p:Project {name: $projectName}) "+
            "MERGE (f:File {name: $fileName})-[:BELONGS_TO]->(p)",
            { fileName, projectName }
        );
        console.log("Created or found file node")
    }

    async createFunctionNode(functionName: string, fileName: string) {
        await this.session.run(
            "MATCH (f:File {name: $fileName}) " +
            "MERGE (func:Function {name: $functionName})-[:DEFINED_IN]->(f)",
            { fileName, functionName }
        );
    }

    async analyzeCode(projectPath: string) {
        const project = new Project();
        const projectName = path.basename(projectPath);
        await this.createProjectNode(projectName);

        project.addSourceFilesAtPaths(path.join(projectPath, "**/*.ts"));

        const sourceFiles = project.getSourceFiles().filter(sf => !sf.getFilePath().includes("node_modules"));
        console.log(sourceFiles.length)
        console.log(sourceFiles.map(
            (sf) => sf.getFilePath()
        ))
        // sourceFiles.forEach(
        //     (sf) => {
        //         sf.getFunctions().forEach(
        //             async (func) => {
        //                 console.log(func.getName());
        //                 console.log(func.getStatements().map( (s) => s.getKindName()));
        //                 await this.createFunctionNode(func.getName() || "", sf.getFilePath());
        //             }
        //         )
        //     }
        // )
        for (const sourceFile of sourceFiles) {
            const filePath = sourceFile.getFilePath();
            await this.createFileNode(filePath, projectName);
            
            // const functions = sourceFile.getFunctions();
            // for (const func of functions) {
            //     await this.createFunctionNode(func.getName() || "", filePath);
            // }
        }
    }
}

export default CodeAnalyzer;
