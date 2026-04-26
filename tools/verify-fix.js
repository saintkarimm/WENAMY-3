const fs = require('fs');
const path = require('path');

const TEST_HTML = path.join(__dirname, '..', 'offplan-test-backup.html');
const toolCode = fs.readFileSync(path.join(__dirname, 'add-offplan.js'), 'utf8');

// Extract insertion functions
const funcNames = ['insertAtLineAfter', 'insertBeforeTarget', 'insertCard', 'insertModal', 'insertJS', 'insertURLParam', 'insertParamMap', 'insertEscapeHandler', 'insertLightboxConst', 'insertLightboxCheck'];
const extracted = {};
funcNames.forEach(name => {
  const regex = new RegExp(`function ${name}\\([\\s\\S]*?^\\}`, 'm');
  const match = toolCode.match(regex);
  if (match) extracted[name] = match[0];
});

const fn = new Function(Object.values(extracted).join('\n\n') + '\nreturn { insertCard, insertModal, insertJS, insertURLParam, insertParamMap, insertEscapeHandler, insertLightboxConst, insertLightboxCheck };');
const f = fn();

const cardHtml = '<!-- TEST CARD -->\n      <article>Test Card</article>\n';
const modalHtml = '<!-- TEST MODAL -->\n  <div id="test99Modal">Test</div>\n';
const jsHtml = '    // Test JS\n    function test99Func() {}\n';

let html = fs.readFileSync(TEST_HTML, 'utf8');
const before = html.length;

try {
  html = f.insertCard(html, cardHtml);
  html = f.insertModal(html, modalHtml);
  html = f.insertJS(html, jsHtml);
  html = f.insertURLParam(html, 'test99', 'Test99');
  html = f.insertParamMap(html, 'test99Modal', 'test99');
  html = f.insertEscapeHandler(html, 'Test99');
  html = f.insertLightboxConst(html, 'test99Modal', 'test99');
  html = f.insertLightboxCheck(html, 'test99', 'Test99');

  fs.writeFileSync(TEST_HTML, html);

  // Verify no duplicate endings
  const endings = [...html.matchAll(/<\/html>/g)];
  const scripts = [...html.matchAll(/<\/script>/g)];

  console.log('File size:', before, '->', html.length);
  console.log('</html> count:', endings.length, '(should be 1)');
  console.log('</script> count (body):', scripts.length, '(should be 6: 5 external + 1 inline)');

  // Verify test content present
  console.log('Card present:', html.includes('TEST CARD'));
  console.log('Modal present:', html.includes('TEST MODAL'));
  console.log('JS present:', html.includes('test99Func'));
  console.log('Param present:', html.includes("projectParam === 'test99'"));
  console.log('Map present:', html.includes("'test99Modal': 'test99'"));
  console.log('Escape present:', html.includes('closeTest99Modal();'));
  console.log('Lightbox const present:', html.includes("const test99Modal = document.getElementById('test99Modal')"));
  console.log('Lightbox check present:', html.includes("test99Modal.classList.contains('active')"));

  if (endings.length === 1) {
    console.log('\nSUCCESS: No file corruption detected.');
  } else {
    console.log('\nFAILED: Duplicate endings found!');
  }
} catch (err) {
  console.error('FAILED:', err.message);
}
