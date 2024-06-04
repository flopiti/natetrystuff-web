import { Driver, Session, driver , auth} from "neo4j-driver";
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

    async createFileNode(fileName: string, purpose: string) {
        await this.session.run(
            "CREATE (f:File {name: $fileName, purpose: $purpose})",
            { fileName, purpose }
        );
        console.log("Created file node")
    }

    async createFunctionNode(functionName: string, fileName: string) {
        await this.session.run(
            "MATCH (f:File {name: $fileName}) " +
            "CREATE (func:Function {name: $functionName})-[:DEFINED_IN]->(f)",
            { fileName, functionName }
        );
    }

    async analyzeCode(projectPath: string, purpose: string) {
        const project = new Project();
        project.addSourceFilesAtPaths(path.join(projectPath, "**/*.ts"));

        const sourceFiles = project.getSourceFiles();
        console.log(sourceFiles.length)
        console.log(sourceFiles[0])
        // for (const sourceFile of sourceFiles) {
            
        //     const filePath = sourceFile.getFilePath();
        //     await this.createFileNode(filePath, purpose);

        //     const functions = sourceFile.getFunctions();
        //     for (const func of functions) {
        //         await this.createFunctionNode(func.getName() || "", filePath);
        //     }
        // }
    }
}

export default CodeAnalyzer;