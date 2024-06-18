import { NextRequest } from 'next/dist/server/web/spec-extension/request';
import { NextResponse } from 'next/server';
import NodeSSH from 'node-ssh';

const ssh = new NodeSSH();

export async function POST(request: NextRequest) {
    try {
        const { command } = await request.json();
        console.log('Received SSH command:', command);
        const host = process.env.SSH_HOST;
        const username = process.env.SSH_USERNAME;
        const password = process.env.SSH_PASSWORD;

        await ssh.connect({
            host,
            username,
            password,
        });

        console.log('Executing command on SSH server...' + command);
        const result = await ssh.execCommand(`bash -c "${command}"`);
        console.log('Command executed. Output:', result);

        return new NextResponse(JSON.stringify({ stdout: result.stdout, stderr: result.stderr }), {
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