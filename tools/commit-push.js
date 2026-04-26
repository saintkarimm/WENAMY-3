const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { ask, askChoice, confirm, close } = require('./lib/prompts');

const SUSPICIOUS_PATTERNS = [
  /backup/i,
  /corrupted/i,
  /corruption/i,
  /fixed/i,
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

function isSuspicious(file) {
  return SUSPICIOUS_PATTERNS.some(p => p.test(file));
}

function runGit(args, silent = false) {
  try {
    return execSync(`git ${args}`, { encoding: 'utf8', cwd: process.cwd() });
  } catch (err) {
    if (silent) return '';
    throw new Error(`git ${args} failed: ${err.stderr || err.message}`);
  }
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

function printStatus({ staged, modified, untracked }) {
  console.log('\n=== Git Status ===');
  if (staged.length) {
    console.log('\nStaged:');
    staged.forEach(f => console.log(`  [${f.status}] ${f.file}`));
  }
  if (modified.length) {
    console.log('\nModified (not staged):');
    modified.forEach(f => console.log(`  [${f.status}] ${f.file}`));
  }
  if (untracked.length) {
    const normal = untracked.filter(f => !isSuspicious(f.file));
    const suspicious = untracked.filter(f => isSuspicious(f.file));
    if (normal.length) {
      console.log('\nUntracked:');
      normal.forEach(f => console.log(`  ${f.file}`));
    }
    if (suspicious.length) {
      console.log('\nUntracked (looks temporary — will warn if staging):');
      suspicious.forEach(f => console.log(`  ⚠️  ${f.file}`));
    }
  }
  if (!staged.length && !modified.length && !untracked.length) {
    console.log('  Working tree clean. Nothing to commit.');
  }
}

async function selectFilesToStage({ staged, modified, untracked }) {
  const allChanged = [...modified.map(f => f.file), ...untracked.map(f => f.file)];
  const suspiciousUntracked = untracked.filter(f => isSuspicious(f.file)).map(f => f.file);

  if (!allChanged.length) {
    if (staged.length) {
      const proceed = await confirm(`${staged.length} file(s) already staged. Proceed with commit?`);
      return proceed ? 'STAGED_ONLY' : null;
    }
    return null;
  }

  const choices = [
    'Stage all changed files (modified + untracked)',
    'Stage only modified files (ignore untracked)',
    'Stage only untracked files (ignore modified)',
    'Pick files individually'
  ];

  if (staged.length) {
    choices.unshift('Use already staged files only');
  }

  const choice = await askChoice('What do you want to stage?', choices);

  if (choice.includes('already staged')) return 'STAGED_ONLY';

  if (choice.includes('all changed')) {
    if (suspiciousUntracked.length) {
      console.log(`\n⚠️  Found ${suspiciousUntracked.length} suspicious untracked file(s):`);
      suspiciousUntracked.forEach(f => console.log(`     ${f}`));
      const includeSuspicious = await confirm('Include these in the commit?');
      if (!includeSuspicious) {
        const addToIgnore = await confirm('Add them to .gitignore instead?');
        if (addToIgnore) {
          await addToGitignore(suspiciousUntracked);
        }
        return allChanged.filter(f => !isSuspicious(f));
      }
    }
    return allChanged;
  }

  if (choice.includes('only modified')) return modified.map(f => f.file);

  if (choice.includes('only untracked')) {
    const untrackedFiles = untracked.map(f => f.file);
    if (suspiciousUntracked.length) {
      console.log(`\n⚠️  Found ${suspiciousUntracked.length} suspicious untracked file(s):`);
      suspiciousUntracked.forEach(f => console.log(`     ${f}`));
      const includeSuspicious = await confirm('Include these in the commit?');
      if (!includeSuspicious) {
        const addToIgnore = await confirm('Add them to .gitignore instead?');
        if (addToIgnore) {
          await addToGitignore(suspiciousUntracked);
        }
        return untrackedFiles.filter(f => !isSuspicious(f));
      }
    }
    return untrackedFiles;
  }

  // Pick individually
  const picked = [];
  for (const file of allChanged) {
    const isSus = isSuspicious(file);
    const prompt = isSus ? `Stage "${file}"? (looks temporary)` : `Stage "${file}"?`;
    const yes = await confirm(prompt);
    if (yes) picked.push(file);
  }
  return picked.length ? picked : null;
}

async function addToGitignore(files) {
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  let content = '';
  if (fs.existsSync(gitignorePath)) {
    content = fs.readFileSync(gitignorePath, 'utf8');
    if (!content.endsWith('\n')) content += '\n';
  }
  const newEntries = files.filter(f => !content.includes(f));
  if (newEntries.length) {
    content += '# Temporary files ignored by commit-push tool\n';
    newEntries.forEach(f => { content += `${f}\n`; });
    fs.writeFileSync(gitignorePath, content);
    console.log(`  Added ${newEntries.length} entry(s) to .gitignore`);
  }
}

async function main() {
  console.log('=== Commit & Push Tool ===\n');

  // Check if we're in a git repo
  try {
    runGit('rev-parse --git-dir', true);
  } catch {
    console.error('Error: Not a git repository.');
    close();
    process.exit(1);
  }

  const status = getStatus();
  printStatus(status);

  if (!status.staged.length && !status.modified.length && !status.untracked.length) {
    close();
    process.exit(0);
  }

  const filesToStage = await selectFilesToStage(status);
  if (!filesToStage) {
    console.log('\nCancelled. No files staged.');
    close();
    process.exit(0);
  }

  if (filesToStage !== 'STAGED_ONLY') {
    const fileList = Array.isArray(filesToStage) ? filesToStage : [filesToStage];
    console.log(`\nStaging ${fileList.length} file(s)...`);
    fileList.forEach(f => {
      try {
        runGit(`add "${f}"`);
        console.log(`  + ${f}`);
      } catch (err) {
        console.error(`  FAILED: ${f} — ${err.message}`);
      }
    });
  }

  const defaultMsg = filesToStage === 'STAGED_ONLY'
    ? 'Update files'
    : `Update ${Array.isArray(filesToStage) ? filesToStage.length : 1} file(s)`;
  const message = await ask('Commit message', defaultMsg);

  if (!message.trim()) {
    console.log('Commit message cannot be empty. Cancelling.');
    close();
    process.exit(1);
  }

  console.log('\nCommitting...');
  try {
    runGit(`commit -m "${message.replace(/"/g, '\\"')}"`);
    console.log('  Committed successfully.');
  } catch (err) {
    console.error(`  Commit failed: ${err.message}`);
    close();
    process.exit(1);
  }

  const currentBranch = runGit('branch --show-current').trim();
  const shouldPush = await confirm(`\nPush to origin/${currentBranch}?`);

  if (shouldPush) {
    console.log(`\nPushing to origin/${currentBranch}...`);
    try {
      runGit(`push origin ${currentBranch}`);
      console.log('  Pushed successfully.');
    } catch (err) {
      console.error(`  Push failed: ${err.message}`);
      close();
      process.exit(1);
    }
  } else {
    console.log('\nPush skipped. Commit is local only.');
  }

  close();
}

main().catch(err => {
  console.error(err);
  close();
  process.exit(1);
});
