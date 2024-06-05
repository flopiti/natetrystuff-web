import { Driver, Session, driver, auth } from "neo4j-driver";
import path from "path";
import { Project as TSProject, SyntaxKind } from "ts-morph";
import { readdirSync, statSync, readFileSync } from 'fs';
import { join } from 'path';

class CodeAnalyzer {
    private driver: Driver;

    constructor(uri: string, user: string, password: string) {
        console.log('building');
        this.driver = driver(uri, auth.basic(user, password));
    }

    async close() {
        await this.driver.close();
    }

    async createProjectNode(session: Session, projectName: string) {
        await session.run(
            "MERGE (p:Project {name: $projectName})",
            { projectName }
        );
        console.log("Created or found project node");
    }

    async createFileNode(session: Session, fileName: string, projectName: string) {
        await session.run(
            "MATCH (p:Project {name: $projectName}) "+
            "MERGE (f:File {name: $fileName})-[:BELONGS_TO]->(p)",
            { fileName, projectName }
        );
        console.log("Created or found file node");
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
            const projectPath = path.join('/Users/nathanpieraut/projects/', projectName);

            if (projectName === 'natetrystuff-api') {
                console.log('Analyzing Java project: ' + projectName);
                const session = this.driver.session();
                await this.createProjectNode(session, projectName);
                await session.close();

                const javaFiles = this.getFilesRecursive(path.join(projectPath, 'natetrystuff/src'), '.java');
                console.log('Java files: ' + javaFiles);
                for (const filePath of javaFiles) {
                    const fileSession = this.driver.session();
                    await this.createFileNode(fileSession, filePath, projectName);

                    const fileContent = readFileSync(filePath, 'utf-8');

                    const methods = this.getJavaMethods(fileContent);
                    console.log(methods)
                    for (const method of methods) {
                        const funcSession = this.driver.session();
                        console.log('Creating function node: ' + method);

                        await this.createFunctionNode(funcSession, method, filePath);
                        await funcSession.close();
                    }
                    await fileSession.close();
                }
            } else {
                console.log('Analyzing TypeScript project: ' + projectName);
                const project = new TSProject();

                const session = this.driver.session();
                await this.createProjectNode(session, projectName);
                await session.close();

                project.addSourceFilesAtPaths(path.join(projectPath, '**/*.ts'));
                const sourceFiles = project.getSourceFiles().filter(sf => !sf.getFilePath().includes("node_modules"));
                console.log('Source files: ' + sourceFiles.map(sf => sf.getFilePath()));
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

    private getFilesRecursive(directory: string, ext: string): string[] {
        const files = readdirSync(directory);
        let foundFiles: string[] = [];

        for (const file of files) {
            const fullPath = join(directory, file);
            const stats = statSync(fullPath);

            if (stats.isDirectory()) {
                foundFiles = foundFiles.concat(this.getFilesRecursive(fullPath, ext));
            } else if (fullPath.endsWith(ext)) {
                foundFiles.push(fullPath);
            }
        }

        return foundFiles;
    }

    private getJavaMethods(fileContent: string): string[] {
        const methodPattern = /\bpublic\b|\bprivate\b|\bprotected\b \b\w+\b .*?\(.*?\) {/g;
        const methods = Array.from(fileContent.matchAll(methodPattern), m => m[0]);
        return methods.map(method => {
            const methodNameMatch = method.match(/\b(\w+)\b(?= \()/);
            return methodNameMatch ? methodNameMatch[0] : ''; 
        }).filter(name => name !== '');
    }
}

export default CodeAnalyzer;
