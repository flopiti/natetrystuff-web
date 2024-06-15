import { NextRequest } from 'next/dist/server/web/spec-extension/request';
import { NextResponse } from 'next/server';
import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

export async function POST(request: NextRequest) {
    try {
        const { host, username, password, command } = await request.json();
        await ssh.connect({
            host,
            username,
            password,
        });

        const result = await ssh.execCommand(command);

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