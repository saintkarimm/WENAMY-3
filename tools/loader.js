const fs = require('fs');
const buf = fs.readFileSync('offplan.html');
let bom = '';
let content;
if (buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
  bom = '\uFEFF';
  content = buf.toString('utf8', 3);
} else {
  content = buf.toString('utf8');
}
const loaderScript = '\n  <script>\n    (function() {\n      var minDisplay = 2200;\n      var maxWait = 4000;\n      var startTime = Date.now();\n      function hideLoader() {\n        var loader = document.getElementById(\'page-loader\');\n        if (loader) loader.classList.add(\'done\');\n      }\n      window.addEventListener(\'DOMContentLoaded\', function() {\n        var elapsed = Date.now() - startTime;\n        var remaining = Math.max(0, minDisplay - elapsed);\n        setTimeout(hideLoader, remaining);\n      });\n      setTimeout(hideLoader, maxWait);\n    })();\n  </script>';
const loaderHTML = '\n  <!-- Page Loader -->\n  <div id="page-loader">\n    <img src="images/icons/logo.webp" alt="Wenamy" class="loader-logo" width="64" height="64">\n    <div class="loader-text">Loading...</div>\n    <div class="loader-bar-track"><div class="loader-bar-fill"></div></div>\n  </div>\n';
content = content.replace('  </style>\r\n</head>\r\n<body>\r\n  <!-- Navigation -->', '  </style>' + loaderScript + '\r\n</head>\r\n<body>' + loaderHTML + '\r\n  <!-- Navigation -->');
fs.writeFileSync('offplan.html', bom + content, 'utf8');
console.log('Done');
