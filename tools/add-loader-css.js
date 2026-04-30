const fs = require('fs');

const buf = fs.readFileSync('offplan.html');
let bom = '';
let content;
if (buf.length >= 3 && buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
  bom = '\uFEFF';
  content = buf.toString('utf8', 3);
} else {
  content = buf.toString('utf8');
}

const css = `
    /* Page Loading Screen */
    #page-loader {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: linear-gradient(135deg, #0d1f2a 0%, #0a151e 50%, #0d1f2a 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: opacity 0.6s ease, visibility 0.6s ease;
    }
    #page-loader.done {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }
    #page-loader .loader-logo {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      animation: loaderPulse 1.6s ease-in-out infinite;
      margin-bottom: 1.5rem;
    }
    @keyframes loaderPulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(0.92); opacity: 0.7; }
    }
    #page-loader .loader-text {
      color: #e2e8f0;
      font-family: 'Cal Sans', 'Afacad', system-ui, sans-serif;
      font-size: 1.25rem;
      letter-spacing: 0.05em;
      margin-bottom: 1.5rem;
    }
    #page-loader .loader-bar-track {
      width: 160px;
      height: 3px;
      background: rgba(255,255,255,0.1);
      border-radius: 2px;
      overflow: hidden;
    }
    #page-loader .loader-bar-fill {
      width: 0%;
      height: 100%;
      background: linear-gradient(90deg, #3d5a6b, #5a8a9e);
      border-radius: 2px;
      animation: loaderBar 2.2s ease-in-out forwards;
    }
    @keyframes loaderBar {
      0% { width: 0%; }
      40% { width: 55%; }
      70% { width: 80%; }
      100% { width: 100%; }
    }`;

const idx = content.indexOf('</style>');
if (idx === -1) {
  console.error('No </style> found');
  process.exit(1);
}

content = content.slice(0, idx) + css + '\n    ' + content.slice(idx);
fs.writeFileSync('offplan.html', bom + content, 'utf8');
console.log('CSS inserted at position', idx);
