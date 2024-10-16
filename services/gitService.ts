export const goMain = async (projectName:string) => {
    await fetch(`/api/go-main?projectName=${projectName}`)
      .then((response) => response.json())
      .then((data) => console.log("API response:", data))
      .catch((error) => console.error("Error fetching the API:", error));
  };

export const gitCheckoutBranch = async (checkoutBranch: string, projectName:string) => {
    if (checkoutBranch.trim()) {
      await fetch(
        `/api/create-branch?project=${projectName}&branchName=${checkoutBranch}`
      )
        .then((response) => response.json())
        .then((data) => console.log("API response:", data))
        .catch((error) => console.error("Error fetching the API:", error));
    } else {
      alert("Please enter a branch name");
    }
  };

export const gitSendIt = (
    commitMessage: string,
    branchName: string,
    projectName: string
) => {
    console.log('send-it')
    console.log(commitMessage);
    console.log(branchName);
    console.log(projectName)
    if (commitMessage.trim() && branchName) {
      fetch(
        `/api/send-it?project=${projectName}&branchName=${branchName}&commitMessage=${commitMessage}`
      )
        .then((response) => response.json())
        .catch((error) => console.error("Error fetching the API:", error));
    }
  };

export const gitDiff = async (projectName:string) => {
        try {
            const response = await fetch(`/api/git-diff?projectName=${projectName}`);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error fetching git diff:', error);
        }
};

export const gitBranch = async (projectName:string, projectDir:string) => {
  const response = await fetch(`api/current-branch?dirPath=${projectDir}/${projectName}`);
  const { data } = await response.json();
  console.log('data', data);
  return data.branchName
}

export const getFileDescriptions = async (projectName:string) => {
      try {
          const response = await fetch(`/api/get-desc-comments?project=${projectName}`);
          const result = await response.json();
          console.log('DESC Comments:', result.data);
      } catch (error) {
          console.error('Error fetching DESC comments:', error);
      }
};
