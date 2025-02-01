async function fetchAndDecryptPAT() {
    try {
        // Fetch the encrypted PAT
        let response = await fetch('token/pat.txt');
        if (!response.ok) throw new Error("Failed to fetch token");
        let encryptedPAT = await response.text();

        // Decryption process (Base10 -> Base64 -> MD5 Hash Check)
        let base10Decoded = atob(encryptedPAT); // Convert from Base64
        let decryptedPAT = base10Decoded; // Placeholder (Add further decryption if needed)

        console.log("Decrypted PAT:", decryptedPAT); // Debugging (Remove in production)
        return decryptedPAT;
    } catch (error) {
        console.error("Error fetching or decrypting PAT:", error);
        return null;
    }
}

// Function to dispatch GitHub Actions workflow
async function triggerWorkflow() {
    let pat = await fetchAndDecryptPAT();
    if (!pat) {
        console.error("PAT decryption failed. Workflow not triggered.");
        return;
    }

    let repoOwner = "unknown07724"; // Your GitHub username
    let repoName = "postbox";       // Your repo
    let workflowFile = "post.yaml"; // Your GitHub Actions workflow file

    let url = `https://api.github.com/repos/${repoOwner}/${repoName}/actions/workflows/${workflowFile}/dispatches`;

    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `token ${pat}`,
            "Accept": "application/vnd.github.v3+json"
        },
        body: JSON.stringify({ ref: "main" }) // Assuming main branch
    });

    if (response.ok) {
        console.log("Workflow triggered successfully!");
    } else {
        console.error("Failed to trigger workflow:", await response.text());
    }
}

// Example: Trigger workflow on button click
document.getElementById("postButton").addEventListener("click", triggerWorkflow);
