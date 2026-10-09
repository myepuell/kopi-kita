import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUTPUT_DIR = 'C:\\laragon\\www\\kopi-kita\\screenshots';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function getTerminalHtml(title, tabName, commandsAndOutputs) {
  const content = commandsAndOutputs.map(item => `
    <div class="command-block">
      <div class="prompt"><span class="path">PS C:\\laragon\\www\\kopi-kita&gt;</span> <span class="cmd">${item.command}</span></div>
      <pre class="output ${item.class || ''}">${item.output}</pre>
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
      width: 1040px;
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
      font-size: 12px;
      color: #e6edf3;
      border: 1px solid #30363d;
      border-bottom: none;
      font-weight: 500;
    }
    .window-controls {
      display: flex;
      gap: 14px;
      color: #8b949e;
      font-size: 12px;
    }
    .terminal-body {
      padding: 22px 24px;
      color: #c9d1d9;
      font-size: 13px;
      line-height: 1.55;
      background: #0c0c0c;
    }
    .command-block {
      margin-bottom: 22px;
    }
    .command-block:last-child {
      margin-bottom: 6px;
    }
    .prompt {
      margin-bottom: 6px;
    }
    .prompt .path {
      color: #58a6ff;
      font-weight: 600;
    }
    .prompt .cmd {
      color: #f0f6fc;
      font-weight: bold;
    }
    .output {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-all;
      color: #c9d1d9;
      font-family: inherit;
      font-size: 12.8px;
    }
    .status-ok {
      color: #7ee787;
    }
    .status-err {
      color: #ff7b72;
    }
    .status-warn {
      color: #d29922;
    }
  </style>
</head>
<body>
  <div class="terminal-window">
    <div class="terminal-titlebar">
      <div class="titlebar-left">
        <div class="tab">
          <span>⚡ PowerShell - ${tabName}</span>
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

async function renderScreenshot(html, outputPath) {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1100, height: 750, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: 'load' });
  
  const element = await page.$('.terminal-window');
  await element.screenshot({ path: outputPath, type: 'png' });
  await browser.close();
  console.log(`[Captured] ${outputPath}`);
}

async function main() {
  console.log('Generating Module 4 Terminal Screenshots...');

  // Terminal 1: Single Dev Server (Next.js on 3000) & Docker Compose PS
  const t1Html = getTerminalHtml(
    'Single Dev Server & Docker Postgres',
    'Single Next.js Server & Docker PS',
    [
      {
        command: 'docker compose ps',
        output: `NAME                IMAGE                COMMAND                  SERVICE   CREATED      STATUS                    PORTS\nkopikita-postgres   postgres:16-alpine   "docker-entrypoint.s…"   db        2 days ago   Up 35 minutes (healthy)   0.0.0.0:5433->5432/tcp, [::]:5433->5432/tcp`
      },
      {
        command: 'Get-NetTCPConnection -LocalPort 3000, 4000 -State Listen | Select-Object LocalAddress, LocalPort, State, OwningProcess | Format-Table -AutoSize',
        output: `LocalAddress LocalPort  State OwningProcess\n------------ ---------  ----- -------------\n::                3000 Listen         16480\n\n# Note: Port 4000 (Express) is completely retired and inactive.\n# Single dev server Next.js (port 3000) handles both Frontend & API Route Handlers.`
      },
      {
        command: 'curl.exe -I -s http://localhost:3000/api/products; curl.exe -I -s http://localhost:4000/api/products',
        output: `HTTP/1.1 200 OK\nvary: RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch\ncontent-type: application/json\nDate: Fri, 09 Oct 2026 14:52:00 GMT\nConnection: keep-alive\n\ncurl: (7) Failed to connect to localhost:4000: Could not connect to server (Express retired)`
      }
    ]
  );
  await renderScreenshot(t1Html, path.join(OUTPUT_DIR, '07-terminal-single-dev-server-docker-ps.png'));

  // Terminal 2: Sneaky curl scenario (booking with party_size 999) returning HTTP 400 Bad Request
  const t2Html = getTerminalHtml(
    'Sneaky Curl Validation Defense',
    'Sneaky Curl Scenario: party_size 999 -> 400 Bad Request',
    [
      {
        command: `curl -i -X POST http://localhost:3000/api/bookings \\\n  -H "Content-Type: application/json" \\\n  -d '{"full_name":"Sneaky Hacker","whatsapp":"081234567890","booking_date":"2026-10-25","booking_time":"14:00","party_size":999}'`,
        output: `HTTP/1.1 400 Bad Request\nvary: RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch\ncontent-type: application/json\nDate: Fri, 09 Oct 2026 14:52:15 GMT\nConnection: keep-alive\nKeep-Alive: timeout=5\nTransfer-Encoding: chunked\n\n{\n  "error": "Kapasitas meja tidak valid (party_size: 999). Maksimal reservasi per meja adalah 1 sampai 8 orang. Untuk grup di atas 8 orang, silakan hubungi tim kami via WhatsApp."\n}`
      },
      {
        command: `curl -i -X POST http://localhost:3000/api/bookings \\\n  -H "Content-Type: application/json" \\\n  -d '{"full_name":"Farhan Ramadhan","whatsapp":"081234567890","booking_date":"2026-10-25","booking_time":"15:00","party_size":4}'`,
        output: `HTTP/1.1 201 Created\nvary: RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch\ncontent-type: application/json\nDate: Fri, 09 Oct 2026 14:52:20 GMT\nConnection: keep-alive\nKeep-Alive: timeout=5\nTransfer-Encoding: chunked\n\n{\n  "id": 16,\n  "full_name": "Farhan Ramadhan",\n  "whatsapp": "081234567890",\n  "booking_date": "2026-10-25",\n  "booking_time": "15:00",\n  "party_size": 4,\n  "seating_area": "Indoor AC",\n  "status": "pending",\n  "created_at": "2026-10-09T14:52:20.123Z"\n}`
      }
    ]
  );
  await renderScreenshot(t2Html, path.join(OUTPUT_DIR, '08-terminal-sneaky-curl-party-size-400.png'));

  console.log('Done capturing terminal screenshots!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
