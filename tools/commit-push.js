const { execSync } = require('child_process');

// Find repo root so tool works from any subdirectory
let REPO_ROOT;
try {
  REPO_ROOT = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
} catch {
  console.error('Error: Not a git repository.');
  process.exit(1);
}

const IGNORE_PATTERNS = [
  /backup/i,
  /corrupted/i,
  /corruption/i,
  /fixed\.html$/i,
  /test-input/i,
  /extract-output/i,
  /migration\.diff$/i,
  /update-prompts/i,
  /verify-fix/i,
  /analyze-corruption/i,
  /fix-corruption/i,
  /check-file/i,
  /\.tmp$/i,
  /\.log$/i,
  /\.diff$/i
];

function runGit(args, silent = false) {
  try {
    return execSync(`git ${args}`, { encoding: 'utf8', cwd: REPO_ROOT });
  } catch (err) {
    if (silent) return '';
    throw new Error(`git ${args} failed: ${err.stderr || err.message}`);
  }
}

function isIgnored(file) {
  return IGNORE_PATTERNS.some(p => p.test(file));
}

function getStatus() {
  const output = runGit('status --porcelain');
  if (!output.trim()) return { staged: [], modified: [], untracked: [] };

  const staged = [];
  const modified = [];
  const untracked = [];

  output.split('\n').forEach(line => {
    if (!line.trim()) return;
    const status = line.slice(0, 2);
    const file = line.slice(3).trim();

    if (status[0] !== ' ' && status[0] !== '?') {
      staged.push({ file, status: status[0] });
    } else if (status[1] === 'M' || status[1] === 'D') {
      modified.push({ file, status: status[1] });
    } else if (status === '??') {
      untracked.push({ file });
    }
  });

  return { staged, modified, untracked };
}

function generateCommitMessage(files) {
  const newOffplans = [];
  const newProjects = [];
  const newUpcoming = [];
  const toolChanges = [];
  const otherChanges = [];

  files.forEach(f => {
    const offplanMatch = f.match(/images\/offplan\/(OFFPLAN\d+)/i);
    const projectMatch = f.match(/images\/properties\/(PROJECT\s*\d+)/i);
    const upcomingMatch = f.match(/images\/properties\/UPCOMING\/(Project\s*\d+)/i);
    const toolMatch = f.match(/tools\/(\S+)/);

    if (offplanMatch && !newOffplans.includes(offplanMatch[1])) {
      newOffplans.push(offplanMatch[1]);
    } else if (upcomingMatch && !newUpcoming.includes(upcomingMatch[1])) {
      newUpcoming.push(upcomingMatch[1]);
    } else if (projectMatch && !newProjects.includes(projectMatch[1])) {
      newProjects.push(projectMatch[1]);
    } else if (toolMatch && !toolChanges.includes(toolMatch[1])) {
      toolChanges.push(toolMatch[1]);
    } else if (!offplanMatch && !projectMatch && !upcomingMatch && !toolMatch) {
      otherChanges.push(f);
    }
  });

  const parts = [];

  if (newOffplans.length) {
    parts.push(`Add ${newOffplans.join(', ')} properties`);
  }
  if (newProjects.length) {
    parts.push(`Add ${newProjects.join(', ')} to completed projects`);
  }
  if (newUpcoming.length) {
    parts.push(`Add ${newUpcoming.join(', ')} to upcoming projects`);
  }
  if (toolChanges.length) {
    parts.push(`Update ${toolChanges.join(', ')}`);
  }

  if (parts.length === 0 && otherChanges.length) {
    return 'Update files and assets';
  }

  if (parts.length === 0) {
    return 'Update files';
  }

  return parts.join('; ');
}

function main() {
  console.log('=== Auto Commit & Push ===\n');
  console.log(`Repo root: ${REPO_ROOT}\n`);

  const status = getStatus();

  if (!status.staged.length && !status.modified.length && !status.untracked.length) {
    console.log('Working tree clean. Nothing to commit.');
    process.exit(0);
  }

  // Collect files to stage
  const filesToStage = [];
  const ignoredFiles = [];

  status.staged.forEach(f => filesToStage.push(f.file));
  status.modified.forEach(f => {
    if (isIgnored(f.file)) {
      ignoredFiles.push(f.file);
    } else {
      filesToStage.push(f.file);
    }
  });
  status.untracked.forEach(f => {
    if (isIgnored(f.file)) {
      ignoredFiles.push(f.file);
    } else {
      filesToStage.push(f.file);
    }
  });

  if (ignoredFiles.length) {
    console.log('Ignoring temp/backup files:');
    ignoredFiles.forEach(f => console.log(`  - ${f}`));
  }

  if (!filesToStage.length) {
    console.log('\nNothing to commit after ignoring temp files.');
    process.exit(0);
  }

  console.log(`\nStaging ${filesToStage.length} file(s)...`);
  filesToStage.forEach(f => {
    try {
      runGit(`add "${f}"`);
      console.log(`  + ${f}`);
    } catch (err) {
      console.error(`  FAILED: ${f} — ${err.message}`);
    }
  });

  const message = generateCommitMessage(filesToStage);
  console.log(`\nCommit message: "${message}"`);

  console.log('\nCommitting...');
  try {
    runGit(`commit -m "${message.replace(/"/g, '\\"')}"`);
    console.log('  Committed successfully.');
  } catch (err) {
    console.error(`  Commit failed: ${err.message}`);
    process.exit(1);
  }

  const currentBranch = runGit('branch --show-current').trim();
  console.log(`\nPushing to origin/${currentBranch}...`);
  try {
    runGit(`push origin ${currentBranch}`);
    console.log('  Pushed successfully.');
  } catch (err) {
    console.error(`  Push failed: ${err.message}`);
    process.exit(1);
  }
}

main();
