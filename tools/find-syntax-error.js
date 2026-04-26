const fs = require('fs');

const html = fs.readFileSync('offplan.html', 'utf8');
const scriptStart = html.indexOf('<script>');
const scriptEnd = html.lastIndexOf('</script>');

if (scriptStart === -1 || scriptEnd === -1) {
  console.log('No script tag found');
  process.exit(1);
}

const js = html.slice(scriptStart + 8, scriptEnd);
const jsLines = js.split('\n');

console.log('Total script lines:', jsLines.length);

try {
  new Function(js);
  console.log('No syntax errors found');
} catch (err) {
  console.error('Syntax error:', err.message);
  
  // Try to find the problematic line by binary search
  let low = 0;
  let high = jsLines.length;
  let errorLine = -1;
  
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    const testCode = jsLines.slice(low, mid + 1).join('\n');
    try {
      new Function(testCode);
      low = mid + 1;
    } catch (e) {
      high = mid;
      errorLine = mid;
    }
  }
  
  console.error('Error around script line:', errorLine + 1);
  console.error('Absolute HTML line:', (html.slice(0, scriptStart + 8).split('\n').length) + errorLine);
  
  const start = Math.max(0, errorLine - 5);
  const end = Math.min(jsLines.length, errorLine + 6);
  console.error('\nContext:');
  for (let i = start; i < end; i++) {
    const marker = i === errorLine ? ' >>> ' : '     ';
    console.error(`${marker}${i + 1}: ${jsLines[i]}`);
  }
}
