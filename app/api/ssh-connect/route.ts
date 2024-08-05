import { NextRequest } from 'next/dist/server/web/spec-extension/request';
import { NextResponse } from 'next/server';
import NodeSSH from 'node-ssh';
import { v4 as uuidv4 } from 'uuid';

const sessions: Record<string, { ssh: NodeSSH; shell: any }> = {};

export async function POST(request: NextRequest) {
    try {
        const { command, sessionId } = await request.json();
        console.log('Received SSH command:', command);

        if (!sessionId) {
            const newSessionId = uuidv4();
            const ssh = new NodeSSH();
            await ssh.connect({
                host: process.env.SSH_HOST,
                username: process.env.SSH_USERNAME,
                password: process.env.SSH_PASSWORD,
            });
            const shell = await ssh.requestShell();
            sessions[newSessionId] = { ssh, shell };
            console.log('New Session Started:', newSessionId);
            return new NextResponse(JSON.stringify({ sessionId: newSessionId }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const currentSession = sessions[sessionId];

        if (!currentSession) {
            throw new Error('Invalid session');
        }

        console.log('Executing command on SSH server...' + command);
        const { shell } = currentSession;
        shell.write(`${command}\n`);

        let response = '';

        const dataListener = (data: any) => {
            const cleanData = data.toString()
                .replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '')   // Removing ANSI escape codes
                .replace(/\[\?2004[hl]/g, '');           // Removing bracketed-paste-mode codes
            console.log('---------------------------------- Data ----------------------------------');
            console.log(cleanData);
            response += cleanData;
        };

        const closeListener = () => {
            shell.removeListener('data', dataListener);
            shell.removeListener('close', closeListener);
        };

        shell.on('data', dataListener);
        shell.on('close', closeListener);

        await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for the command to execute

        shell.removeListener('data', dataListener);
        shell.removeListener('close', closeListener);

        console.log('Command executed. Output:', response);

        return new NextResponse(JSON.stringify({ output: response }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error during SSH connection:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to establish SSH connection' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}