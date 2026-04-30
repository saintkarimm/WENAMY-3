const fs = require('fs');

const buf = fs.readFileSync('offplan.html');
let html;
if (buf.length >= 2 && buf[0] === 0xFF && buf[1] === 0xFE) {
  html = buf.toString('utf16le', 2);
} else {
  html = buf.toString('utf8');
}

const loaderCSS = `
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

const loaderScript = `
  <script>
    (function() {
      var minDisplay = 2200;
      var maxWait = 4000;
      var startTime = Date.now();
      function hideLoader() {
        var loader = document.getElementById('page-loader');
        if (loader) loader.classList.add('done');
      }
      window.addEventListener('DOMContentLoaded', function() {
        var elapsed = Date.now() - startTime;
        var remaining = Math.max(0, minDisplay - elapsed);
        setTimeout(hideLoader, remaining);
      });
      setTimeout(hideLoader, maxWait);
    })();
  </script>`;

const loaderHTML = `
  <!-- Page Loader -->
  <div id="page-loader">
    <img src="images/icons/logo.webp" alt="Wenamy" class="loader-logo" width="64" height="64">
    <div class="loader-text">Loading...</div>
    <div class="loader-bar-track"><div class="loader-bar-fill"></div></div>
  </div>
`;

// Insert CSS before </style>
html = html.replace('  </style>\r\n</head>', loaderCSS + '\r\n  </style>' + loaderScript + '\r\n</head>');

// Insert HTML after <body>
html = html.replace('<body>\r\n  <!-- Navigation -->', '<body>' + loaderHTML + '\r\n  <!-- Navigation -->');

fs.writeFileSync('offplan.html', html, 'utf8');
console.log('Done: loading screen added');
