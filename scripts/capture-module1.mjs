import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
];

let browserPath = CHROME_PATHS.find(p => fs.existsSync(p));
if (!browserPath) {
  throw new Error('No compatible browser found for screenshot capture');
}

const OUTPUT_DIR = 'C:\\laragon\\www\\kopi-kita\\screenshots';
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function getTerminalHtml() {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      margin: 0;
      padding: 30px;
      background: #0d1117;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'Cascadia Code', 'Consolas', 'Courier New', monospace;
    }
    .terminal-window {
      width: 960px;
      background: #0c0c0c;
      border: 1px solid #30363d;
      border-radius: 10px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
      overflow: hidden;
    }
    .terminal-titlebar {
      background: #161b22;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #30363d;
    }
    .titlebar-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .tab {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #0c0c0c;
      padding: 6px 16px;
      border-radius: 6px 6px 0 0;
      font-size: 12.5px;
      color: #e6edf3;
      border: 1px solid #30363d;
      border-bottom: none;
    }
    .window-controls {
      display: flex;
      gap: 14px;
      color: #8b949e;
      font-size: 12px;
    }
    .terminal-body {
      padding: 24px 28px;
      color: #e6edf3;
      font-size: 14px;
      line-height: 1.55;
      background: #0c0c0c;
    }
    .command-block {
      margin-bottom: 22px;
    }
    .prompt {
      margin-bottom: 6px;
    }
    .prompt .path {
      color: #58a6ff;
      font-weight: 600;
    }
    .prompt .cmd {
      color: #ffffff;
      font-weight: 600;
    }
    .output {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-all;
      color: #c9d1d9;
      font-family: inherit;
      font-size: 13.5px;
    }
    .success-check {
      color: #3fb950;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="terminal-window">
    <div class="terminal-titlebar">
      <div class="titlebar-left">
        <div class="tab">
          <span>⚡ PowerShell - kopi-kita</span>
        </div>
      </div>
      <div class="window-controls">
        <span>─</span>
        <span>□</span>
        <span>✕</span>
      </div>
    </div>
    <div class="terminal-body">
      <div class="command-block">
        <div class="prompt"><span class="path">PS C:\\laragon\\www\\kopi-kita&gt;</span> <span class="cmd">node -v</span></div>
        <pre class="output">v22.23.2</pre>
      </div>

      <div class="command-block">
        <div class="prompt"><span class="path">PS C:\\laragon\\www\\kopi-kita&gt;</span> <span class="cmd">gh auth status</span></div>
        <pre class="output">github.com
  <span class="success-check">✓</span> Logged in to github.com account myepuell (keyring)
  - Active account: true
  - Git operations protocol: https
  - Token: gho_************************************
  - Token scopes: 'gist', 'read:org', 'repo'</pre>
      </div>

      <div class="command-block">
        <div class="prompt"><span class="path">PS C:\\laragon\\www\\kopi-kita&gt;</span> <span class="cmd">codex --version</span></div>
        <pre class="output">codex-cli 0.162.0</pre>
      </div>

      <div class="prompt"><span class="path">PS C:\\laragon\\www\\kopi-kita&gt;</span> <span class="cmd">_</span></div>
    </div>
  </div>
</body>
</html>
  `;
}

async function run() {
  console.log(`Launching browser from: ${browserPath}`);
  const browser = await puppeteer.launch({
    executablePath: browserPath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1040, height: 600, deviceScaleFactor: 2 });
  
  const html = getTerminalHtml();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const outputPath = path.join(OUTPUT_DIR, '00-terminal-setup-node-gh-codex.png');
  await page.screenshot({ path: outputPath });
  console.log(`Screenshot saved successfully: ${outputPath}`);

  await browser.close();
}

run().catch(err => {
  console.error('Error taking screenshot:', err);
  process.exit(1);
});
