const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question, defaultValue = '') {
  const prompt = defaultValue ? `${question} (${defaultValue}): ` : `${question}: `;
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

function askNumber(question, defaultValue = '') {
  return ask(question, defaultValue).then(val => {
    const num = parseFloat(val.replace(/,/g, ''));
    if (isNaN(num)) {
      console.log('Please enter a valid number.');
      return askNumber(question, defaultValue);
    }
    return num;
  });
}

function askList(question) {
  return ask(question).then(val => {
    if (!val) return [];
    return val.split(',').map(s => s.trim()).filter(Boolean);
  });
}

function askChoice(question, choices) {
  const choiceStr = choices.map((c, i) => `${i + 1}. ${c}`).join('\n');
  return ask(`${question}\n${choiceStr}\nEnter number`).then(val => {
    const num = parseInt(val, 10);
    if (isNaN(num) || num < 1 || num > choices.length) {
      console.log('Invalid choice.');
      return askChoice(question, choices);
    }
    return choices[num - 1];
  });
}

function confirm(question) {
  return ask(`${question} (y/n)`).then(val => val.toLowerCase() === 'y');
}

function close() {
  rl.close();
}

function askMultiChoice(question, choices) {
  const choiceStr = choices.map((c, i) => `${i + 1}. ${c}`).join('\n');
  return ask(`${question} (enter numbers separated by commas)\n${choiceStr}\nEnter numbers`).then(val => {
    if (!val.trim()) return [];
    const nums = val.split(/[,\s]+/).map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    const selected = [...new Set(nums.filter(n => n >= 1 && n <= choices.length).map(n => choices[n - 1]))];
    if (!selected.length) {
      console.log('Invalid choice. Please enter at least one valid number.');
      return askMultiChoice(question, choices);
    }
    return selected;
  });
}

module.exports = { ask, askNumber, askList, askChoice, askMultiChoice, confirm, close };
