import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUTPUT_DIR = 'C:\\laragon\\www\\kopi-kita\\screenshots';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
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

    // 1. Full landing page (desktop)
    console.log('Capturing Screenshot 1: Desktop Landing Page...');
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '01-landing-page-desktop.png'),
      fullPage: true
    });
    console.log('Screenshot 1 captured!');

    // 2. Menu page with one category active (not "All") - Pastry showing Sold Out
    console.log('Capturing Screenshot 2: Menu Page with Pastry tab active...');
    await page.goto('http://localhost:3000/menu', { waitUntil: 'networkidle2' });
    
    // Find and click button with text "Pastry"
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const pBtn = btns.find(b => b.textContent && b.textContent.includes('Pastry'));
      if (pBtn) pBtn.click();
    });

    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '02-menu-category-active.png'),
      fullPage: false
    });
    console.log('Screenshot 2 captured!');

    // 3. Booking form showing confirmation card after valid data was entered
    console.log('Capturing Screenshot 3: Booking Confirmation Card...');
    await page.goto('http://localhost:3000/booking', { waitUntil: 'networkidle2' });
    
    // Calculate tomorrow date YYYY-MM-DD
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    await page.type('#fullName', 'Budi Santoso');
    await page.type('#whatsapp', '081234567890');
    
    // Set date input with native value setter for React
    await page.evaluate((val) => {
      const input = document.querySelector('#date');
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeInputValueSetter.call(input, val);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, tomorrowStr);

    // Select time slot
    await page.select('#time', '14:00 WIB');

    // Click submit button
    await page.click('button[type="submit"]');

    await new Promise(r => setTimeout(r, 1000));
    const pageErrors = await page.evaluate(() => {
      const errNodes = Array.from(document.querySelectorAll('p.text-red-600, .text-red-500'));
      return errNodes.map(n => n.textContent);
    });
    console.log('Page validation errors after submit:', pageErrors);

    const values = await page.evaluate(() => {
      return {
        name: document.querySelector('#fullName')?.value,
        whatsapp: document.querySelector('#whatsapp')?.value,
        date: document.querySelector('#date')?.value,
        time: document.querySelector('#time')?.value,
      };
    });
    console.log('Form field values:', values);

    // Wait for confirmation card to appear
    await page.waitForSelector('#confirmation-card', { timeout: 8000 });
    await new Promise(r => setTimeout(r, 800));

    // Scroll to confirmation card
    await page.evaluate(() => {
      const card = document.getElementById('confirmation-card');
      if (card) card.scrollIntoView({ behavior: 'instant', block: 'center' });
    });

    await page.screenshot({
      path: path.join(OUTPUT_DIR, '03-booking-confirmation-card.png'),
      fullPage: false
    });
    console.log('Screenshot 3 captured!');

    // 4. One of the pages at phone width, with the navbar looking tidy
    console.log('Capturing Screenshot 4: Phone width with tidy navbar...');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(OUTPUT_DIR, '04-mobile-navbar.png'),
      fullPage: false
    });
    console.log('Screenshot 4 captured!');

  } catch (err) {
    console.error('Error during capture:', err);
    throw err;
  } finally {
    await browser.close();
    console.log('Browser closed successfully.');
  }
}

run();
