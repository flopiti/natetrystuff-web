export const goMain = (projectName:string) => {
    fetch(`/api/go-main?projectName=${projectName}`)
      .then((response) => response.json())
      .then((data) => console.log("API response:", data))
      .catch((error) => console.error("Error fetching the API:", error));
  };

export const gitCheckoutBranch = (checkoutBranch: string, projectName:string) => {
    if (checkoutBranch.trim()) {
      fetch(
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
    if (commitMessage.trim() && branchName) {
      fetch(
        `/api/send-it?project=${projectName}&branchName=${branchName}&commitMessage=${commitMessage}`
      )
        .then((response) => response.json())
        .catch((error) => console.error("Error fetching the API:", error));
    }
  };