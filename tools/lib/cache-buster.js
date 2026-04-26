const fs = require('fs');

function incrementCacheBusters(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Match ?v=N patterns and increment
  content = content.replace(/\?v=(\d+)/g, (match, num) => {
    const newNum = parseInt(num, 10) + 1;
    return `?v=${newNum}`;
  });

  const changed = content !== original;
  if (changed) {
    fs.writeFileSync(filePath, content);
  }
  return changed;
}

module.exports = { incrementCacheBusters };
