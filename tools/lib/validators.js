function toCamelCase(str) {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[^a-zA-Z]*/, '')
    .replace(/^[a-zA-Z]/, c => c.toLowerCase());
}

function toKebabCase(str) {
  return str
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function generateFunctionBase(title, folderName) {
  // Use folder number if available, otherwise derive from title
  const match = folderName.match(/(\d+)$/);
  if (match) {
    const num = match[1];
    const base = toCamelCase(title.replace(/\d+/g, '').trim());
    return base + num;
  }
  return toCamelCase(title);
}

function checkExists(content, modalId, functionBase) {
  const issues = [];
  if (content.includes(`id="${modalId}"`)) {
    issues.push(`Modal ID "${modalId}" already exists`);
  }
  if (content.includes(`function open${functionBase.charAt(0).toUpperCase() + functionBase.slice(1)}Modal()`)) {
    issues.push(`Function "open${functionBase.charAt(0).toUpperCase() + functionBase.slice(1)}Modal" already exists`);
  }
  return issues;
}

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

module.exports = { toCamelCase, toKebabCase, generateFunctionBase, checkExists, ordinal };
