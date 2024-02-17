const fs = require('fs');
const { execSync } = require('child_process');
const core = require('@actions/core');

try {
  const noteName = process.env.NOTE_NAME;
  const noteContent = process.env.NOTE_CONTENT;
  let fileName;

  const branchName = process.env.GITHUB_HEAD_REF;
  if (branchName) {
    execSync(`git checkout ${branchName}`);
  }

  if (fs.existsSync(`releasenotes/notes/${noteName}.yaml`)) {
    console.log("Updating existing note.");
    fileName = `releasenotes/notes/${noteName}.yaml`;
  } else {
    console.log("Creating new note.");
    execSync(`reno new ${noteName}`);
    fileName = fs.readdirSync('releasenotes/notes/').find(file => file.startsWith(noteName));
    console.log(`Note created: ${fileName}`);
  }

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
