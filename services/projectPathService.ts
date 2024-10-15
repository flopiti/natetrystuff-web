

export async function fetchProjectPaths(): Promise<any[]> {
    const response = await fetch('/api/project-paths');
    if (!response.ok) {
        throw new Error(`Failed to fetch project paths: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
}

export async function addProjectPath(path: string): Promise<void> {
    const response = await fetch('/api/project-paths', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path }),
    });

    if (!response.ok) {
        throw new Error(`Failed to create project path: ${response.statusText}`);
    }
}

export async function removeProjectPath(path: string): Promise<void> {
    const response = await fetch('/api/project-paths', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path }),
    });

    if (!response.ok) {
        throw new Error(`Failed to remove project path: ${response.statusText}`);
    }
}