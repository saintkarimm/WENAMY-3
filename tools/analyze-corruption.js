const fs = require('fs');
const html = fs.readFileSync('offplan-corrupted.html', 'utf8');
const lines = html.split('\n');

console.log('Total lines:', lines.length);
console.log('Total chars:', html.length);

lines.forEach((line, i) => {
  if (line.includes('</html>')) {
    console.log('</html> at line', i + 1);
  }
});

// Check context around each </html>
const htmlMatches = [...html.matchAll(/<\/html>/g)];
htmlMatches.forEach((m, idx) => {
  const lineNum = html.slice(0, m.index).split('\n').length;
  const prev200 = html.slice(Math.max(0, m.index - 200), m.index);
  console.log(`\n--- Context before </html> #${idx + 1} (line ${lineNum}) ---`);
  console.log(prev200.slice(-200));
});
