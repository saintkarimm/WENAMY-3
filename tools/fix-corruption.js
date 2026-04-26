const fs = require('fs');
const html = fs.readFileSync('offplan-corrupted.html', 'utf8');
const lines = html.split('\n');

console.log('Total lines:', lines.length);

const htmlLines = [];
lines.forEach((line, i) => {
  if (line.includes('</html>')) htmlLines.push(i);
});

htmlLines.forEach((lineIdx, idx) => {
  console.log(`\n</html> #${idx + 1} at line ${lineIdx + 1}`);
  console.log('Last 5 lines before it:');
  for (let i = Math.max(0, lineIdx - 5); i <= lineIdx; i++) {
    console.log(`  ${i + 1}: ${lines[i].slice(0, 80)}`);
  }
});

// Find the first </html> that is preceded by </script> and </body>
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('</html>')) {
    const prev1 = lines[i - 1] || '';
    const prev2 = lines[i - 2] || '';
    if (prev1.includes('</body>') && prev2.includes('</script>')) {
      console.log(`\n>>> First valid-looking </html> at line ${i + 1}`);
      // Check if content after this is duplicate
      const after = lines.slice(i + 1).join('\n').trim();
      const before = lines.slice(Math.max(0, i - 100), i).join('\n');
      console.log('Content after length:', after.length);
      if (after.length > 0) {
        console.log('First non-empty line after:', lines.slice(i + 1).find(l => l.trim()));
      }
      break;
    }
  }
}
