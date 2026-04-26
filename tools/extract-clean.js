const { execSync } = require('child_process');
const fs = require('fs');

const html = execSync('git show 4bc7ae6:offplan.html', {
  encoding: 'utf8',
  maxBuffer: 50 * 1024 * 1024,
  cwd: 'C:\\Users\\SAINTKARIM\\Desktop\\WENAMY 3'
});

console.log('File length:', html.length);

const lines = html.split('\n');
const htmlLines = [];
lines.forEach((line, i) => {
  if (line.includes('</html>')) htmlLines.push(i);
});

console.log('</html> count:', htmlLines.length);
htmlLines.forEach((idx, i) => {
  console.log(`\n#${i + 1} at line ${idx + 1}`);
  for (let j = Math.max(0, idx - 3); j <= idx; j++) {
    console.log(`  ${j + 1}: ${lines[j].slice(0, 70)}`);
  }
});

// Find the real end: the first </html> preceded by </body> and </script>
for (let idx of htmlLines) {
  const prev1 = lines[idx - 1] || '';
  const prev2 = lines[idx - 2] || '';
  if (prev1.includes('</body>') && prev2.includes('</script>')) {
    console.log(`\n>>> First valid ending at line ${idx + 1}`);
    // Check what's after
    const after = lines.slice(idx + 1).join('\n').trim();
    console.log('After length:', after.length);
    if (after.length > 0) {
      const firstNonEmpty = lines.slice(idx + 1).find(l => l.trim());
      console.log('First non-empty after:', firstNonEmpty ? firstNonEmpty.slice(0, 70) : 'none');
    }
    break;
  }
}
