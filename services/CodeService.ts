export const getCurrentBranch = async (
    dirPath: string,
    selectedProjectName: string,
) => {
    const response = await fetch(`api/current-branch?dirPath=${dirPath}/${selectedProjectName}`);
    const { data } = await response.json();
    return data.branchName;
};