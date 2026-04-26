const fs = require('fs');
const h = fs.readFileSync('offplan.html', 'utf8');
const lines = h.split('\n');
console.log('Lines:', lines.length, 'Chars:', h.length);
console.log('</html> count:', (h.match(/<\/html>/g) || []).length);

let cardCount = 0;
lines.forEach((l, i) => {
  if (l.includes('class="offplan-luxury-card"')) {
    cardCount++;
  }
});
console.log('Card count:', cardCount);
