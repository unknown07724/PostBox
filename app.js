document.addEventListener("DOMContentLoaded", function () {
    // Check if user is signed up (username stored in localStorage)
    const username = localStorage.getItem("username");

    if (username) {
        showPostForm(username);  // If signed up, show the post form
    } else {
        showSignupPrompt();  // If not signed up, show the signup prompt
    }
});

function showSignupPrompt() {
    const signupPrompt = document.createElement("div");
    signupPrompt.id = "signupPrompt";
    signupPrompt.innerHTML = `
        <h1>Sign Up</h1>
        <label for="signupUsername">Username:</label>
        <input type="text" id="signupUsername" name="signupUsername" required>
        <br>
        <button id="signupButton">Sign Up</button>
    `;
    document.body.appendChild(signupPrompt);

    // Handle the signup button click
    document.getElementById("signupButton").addEventListener("click", signup);
}

function signup() {
    const username = document.getElementById("signupUsername").value;

    // Validate the username
    if (!username) {
        alert("Username is required!");
        return;
    }

    // Save the username to localStorage for future posts
    localStorage.setItem("username", username);
    
    // Remove the signup prompt and show the post form
    document.getElementById("signupPrompt").remove();
    showPostForm(username);
}

function showPostForm(username) {
    const postForm = document.createElement("div");
    postForm.id = "postForm";
    postForm.innerHTML = `
        <h1>Submit Your Post</h1>
        <label for="content">Content:</label>
        <textarea id="content" name="content" required></textarea>
        <br>
        <button id="submitPostButton">Submit Post</button>
    `;
    document.body.appendChild(postForm);

    // Handle the post submission
    document.getElementById("submitPostButton").addEventListener("click", function () {
        submitPost(username);
    });
}

async function submitPost(username) {
    const content = document.getElementById("content").value;  // Get the post content

    // Validate the input
    if (!content) {
        alert("Content is required!");
        return;
    }

    // GitHub Actions API URL (replace with your own repo details)
    const githubApiUrl = 'https://api.github.com/repos/unknown07724/postbox/actions/workflows/post.yml/dispatches';

    const postData = {
        ref: 'main',  // Branch to trigger the workflow on
        inputs: {
            username: username,
            content: content
        }
    };

    try {
        const response = await fetch(githubApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer YOUR_GITHUB_PERSONAL_ACCESS_TOKEN`, // Replace with your PAT
            },
            body: JSON.stringify(postData)
        });

        if (response.ok) {
            alert("Post submitted successfully!");
            document.getElementById("content").value = '';  // Clear the content field
        } else {
            const error = await response.json();
            console.error('Error:', error);
            alert('Failed to submit post.');
        }
    } catch (error) {
        console.error('Error submitting post:', error);
        alert('Error submitting post.');
    }
}
