const fs = require('fs');
const { execSync } = require('child_process');
const core = require('@actions/core');
const axios = require('axios');

try {
  const noteName = process.env.NOTE_NAME;
  const noteContent = process.env.NOTE_CONTENT;
  const branchName = process.env.GITHUB_HEAD_REF;
  const baseBranchName = process.env.GITHUB_BASE_REF;
  const repo = process.env.GITHUB_REPOSITORY;
  const token = process.env.GITHUB_TOKEN;

  if (!branchName || !baseBranchName || !repo || !token) {
    throw new Error('GITHUB_HEAD_REF, GITHUB_BASE_REF, GITHUB_REPOSITORY, or GITHUB_TOKEN is not set');
  }

  const [owner, repoName] = repo.split('/');

  // Use GitHub REST API to compare branches
  const compareUrl = `https://api.github.com/repos/${owner}/${repoName}/compare/${baseBranchName}...${branchName}`;
  const response = await axios.get(compareUrl, {
    headers: { Authorization: `token ${token}` }
  });

  const files = response.data.files;
  const noteAlreadyExists = files.some(file => file.filename.startsWith('releasenotes/notes/') && file.filename.endsWith('.yaml'));

  if (noteAlreadyExists) {
    console.log("Existing note detected. Skipping further actions.");
    return; // Exit the script without performing any further actions
  }
  let fileName;

  // Checkout the branch if it exists
  if (branchName) {
    try {
      execSync(`git checkout ${branchName}`);
      console.log(`Checked out branch: ${branchName}`);
    } catch (error) {
      throw new Error(`Failed to checkout branch ${branchName}: ${error.message}`);
    }
  }

  console.log("Creating new note.");
  execSync(`reno new ${noteName}`);
  fileName = fs.readdirSync('releasenotes/notes/').find(file => file.startsWith(noteName));
  console.log(`Note created: ${fileName}`);

  fs.writeFileSync(`releasenotes/notes/${fileName}`, noteContent + '\n'); // Newline at the end
  console.log(`Content successfully written to releasenotes/notes/${fileName}`);

  // Perhaps allow for custom user and email?
  execSync('git config user.email "action@github.com"');
  execSync('git config user.name "GitHub Action"');

  // Do the git dance
  execSync(`git add releasenotes/notes/${fileName}`);
  execSync('git commit -m "Add release note"');
  execSync(`git push origin HEAD:${branchName}`);

} catch (error) {
  core.setFailed(`Action failed with error ${error}`);
}
