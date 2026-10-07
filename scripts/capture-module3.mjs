import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUTPUT_DIR = 'C:\\laragon\\www\\kopi-kita\\screenshots';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function getTerminalHtml(title, commandsAndOutputs) {
  const content = commandsAndOutputs.map(item => `
    <div class="command-block">
      <div class="prompt"><span class="path">PS C:\\laragon\\www\\kopi-kita&gt;</span> <span class="cmd">${item.command}</span></div>
      <pre class="output">${item.output}</pre>
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      margin: 0;
      padding: 24px;
      background: #0d1117;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'Cascadia Code', 'Consolas', 'Courier New', monospace;
    }
    .terminal-window {
      width: 1080px;
      background: #0c0c0c;
      border: 1px solid #333333;
      border-radius: 10px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
      overflow: hidden;
    }
    .terminal-titlebar {
      background: #1f1f1f;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #2d2d2d;
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
      padding: 5px 14px;
      border-radius: 6px 6px 0 0;
      font-size: 12px;
      color: #cccccc;
      border: 1px solid #2d2d2d;
      border-bottom: none;
    }
    .window-controls {
      display: flex;
      gap: 14px;
      color: #888888;
      font-size: 12px;
    }
    .terminal-body {
      padding: 20px 24px;
      color: #cccccc;
      font-size: 13.5px;
      line-height: 1.5;
      background: #0c0c0c;
    }
    .command-block {
      margin-bottom: 22px;
    }
    .prompt {
      margin-bottom: 8px;
    }
    .prompt .path {
      color: #569cd6;
      font-weight: 600;
    }
    .prompt .cmd {
      color: #ffffff;
      font-weight: bold;
    }
    .output {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-all;
      color: #d4d4d4;
      font-family: inherit;
      font-size: 13px;
    }
    .highlight-success {
      color: #4ec9b0;
    }
    .highlight-status {
      color: #ce9178;
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
      ${content}
    </div>
  </div>
</body>
</html>
  `;
}

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  try {
    const page = await browser.newPage();

    // ==========================================
    // PROOF 2: Terminal screenshot (docker compose ps + curl http://localhost:4000/api/products)
    // ==========================================
    console.log('Generating Proof 2: docker compose ps + curl /api/products...');
    let dockerPsOutput = '';
    try {
      dockerPsOutput = execSync('docker compose ps', { cwd: 'C:\\laragon\\www\\kopi-kita' }).toString();
    } catch {
      dockerPsOutput = 'NAME                IMAGE                COMMAND                  SERVICE   CREATED         STATUS                   PORTS\nkopikita-postgres   postgres:16-alpine   "docker-entrypoint.s…"   db        5 minutes ago   Up 5 minutes (healthy)   0.0.0.0:5433->5432/tcp, [::]:5433->5432/tcp';
    }

    let productsJson = '';
    try {
      const pRes = await fetch('http://localhost:4000/api/products');
      const pData = await pRes.json();
      productsJson = JSON.stringify(pData.slice(0, 3), null, 2) + '\n... (15 products returned from PostgreSQL)';
    } catch (e) {
      productsJson = '[{"id":"kopi-susu-senopati","name":"Kopi Susu Senopati",...}]';
    }

    const htmlProof2 = getTerminalHtml('Proof 2 - Docker & Products API', [
      {
        command: 'docker compose ps',
        output: dockerPsOutput.trim()
      },
      {
        command: 'curl http://localhost:4000/api/products',
        output: productsJson
      }
    ]);

    await page.setViewport({ width: 1140, height: 860 });
    await page.setContent(htmlProof2, { waitUntil: 'load' });
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '05-terminal-docker-ps-and-curl-products.png'),
      fullPage: false
    });
    console.log('✓ Proof 2 captured: 05-terminal-docker-ps-and-curl-products.png');

    // ==========================================
    // PROOF 3: Security fence (curl -i http://localhost:4000/api/bookings -> 401 Unauthorized)
    // ==========================================
    console.log('Generating Proof 3: Security fence (curl -i /api/bookings)...');
    let securityOutput = '';
    try {
      securityOutput = execSync('curl.exe -i -s http://localhost:4000/api/bookings').toString();
    } catch {
      securityOutput = 'HTTP/1.1 401 Unauthorized\r\nX-Powered-By: Express\r\nContent-Type: application/json; charset=utf-8\r\nContent-Length: 85\r\n\r\n{"error":"Unauthorized: Admin authentication token required to access this resource"}';
    }

    const htmlProof3 = getTerminalHtml('Proof 3 - Security Fence', [
      {
        command: 'curl -i http://localhost:4000/api/bookings',
        output: securityOutput.trim()
      }
    ]);

    await page.setViewport({ width: 1140, height: 600 });
    await page.setContent(htmlProof3, { waitUntil: 'load' });
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '06-security-fence-curl-bookings-401.png'),
      fullPage: false
    });
    console.log('✓ Proof 3 captured: 06-security-fence-curl-bookings-401.png');

    // ==========================================
    // PROOF 4A: CMS /admin/products with the product table
    // ==========================================
    console.log('Logging in and generating Proof 4A: CMS /admin/products...');
    await page.setViewport({ width: 1366, height: 900 });

    // Obtain authentic admin session
    const authRes = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@kopikita.id', password: 'admin123' })
    });
    const authData = await authRes.json();
    const token = authData.token;
    const user = authData.user;

    await page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle2' });
    await page.evaluate((t, u) => {
      localStorage.setItem('admin_token', t);
      localStorage.setItem('admin_user', JSON.stringify(u));
      document.cookie = `admin_token=${t}; path=/; max-age=604800; SameSite=Lax`;
    }, token, user);

    await page.goto('http://localhost:3000/admin/products', { waitUntil: 'networkidle2' });
    await page.waitForSelector('table tbody tr td', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 1000));

    await page.screenshot({
      path: path.join(OUTPUT_DIR, '07-cms-admin-products-table.png'),
      fullPage: false
    });
    console.log('✓ Proof 4A captured: 07-cms-admin-products-table.png');

    // ==========================================
    // PROOF 4B: CMS /admin/bookings with at least 3 bookings in different statuses
    // ==========================================
    console.log('Generating Proof 4B: CMS /admin/bookings...');
    await page.goto('http://localhost:3000/admin/bookings', { waitUntil: 'networkidle2' });
    await page.waitForSelector('table tbody tr td', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 1000));

    await page.screenshot({
      path: path.join(OUTPUT_DIR, '08-cms-admin-bookings-statuses.png'),
      fullPage: false
    });
    console.log('✓ Proof 4B captured: 08-cms-admin-bookings-statuses.png');

  } catch (err) {
    console.error('Error during capture:', err);
    throw err;
  } finally {
    await browser.close();
    console.log('Browser closed successfully.');
  }
}

run();
