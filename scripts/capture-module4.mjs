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

async function setReactInputValue(page, selector, value) {
  await page.evaluate((sel, val) => {
    const el = document.querySelector(sel);
    if (el) {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      ).set;
      nativeSetter.call(el, val);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, selector, value);
}

async function capture() {
  console.log(`Launching browser: ${browserPath}`);
  const browser = await puppeteer.launch({
    executablePath: browserPath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,860']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 860, deviceScaleFactor: 2 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  // ----------------------------------------------------
  // 1. /menu page showing products from database
  // ----------------------------------------------------
  console.log('Step 1: Capturing /menu page with database products...');
  await page.goto('http://localhost:3000/menu', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelectorAll('h3').length > 5, { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01-menu-database-products.png') });
  console.log('✓ Saved 01-menu-database-products.png');

  // ----------------------------------------------------
  // 2. Admin Login & Edit product in CMS
  // ----------------------------------------------------
  console.log('Step 2: Authenticating admin session & opening Edit modal...');
  await page.goto('http://localhost:3000/admin/login', { waitUntil: 'domcontentloaded' });
  await page.evaluate(async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@kopikita.id', password: 'admin123' })
    });
    const data = await res.json();
    localStorage.setItem('admin_token', data.token);
    localStorage.setItem('admin_user', JSON.stringify(data.user));
    document.cookie = `admin_token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
  });
  await new Promise(r => setTimeout(r, 500));

  // Navigate to /admin/products with auth credentials set
  await page.goto('http://localhost:3000/admin/products', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('button[title="Edit Produk"]', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1000));

  // Click edit on the first product
  const editButtons = await page.$$('button[title="Edit Produk"]');
  if (editButtons.length > 0) {
    await editButtons[0].click();
    await new Promise(r => setTimeout(r, 1000));

    // Edit price and name in modal
    const nameInput = await page.$('input[placeholder="Contoh: Espresso Romano"]');
    if (nameInput) {
      const currentVal = await page.evaluate(el => el.value, nameInput);
      if (!currentVal.includes('Signature')) {
        await setReactInputValue(page, 'input[placeholder="Contoh: Espresso Romano"]', currentVal + ' Signature');
      }
    }

    await setReactInputValue(page, 'input[type="number"]', '39000');
    await new Promise(r => setTimeout(r, 500));

    await page.screenshot({ path: path.join(OUTPUT_DIR, '02-cms-product-edit-modal.png') });
    console.log('✓ Saved 02-cms-product-edit-modal.png');

    // Click submit in modal
    const modalSubmitBtn = await page.$('div.relative button[type="submit"]');
    if (modalSubmitBtn) {
      await modalSubmitBtn.click();
    }
    await new Promise(r => setTimeout(r, 2000));
  }

  // ----------------------------------------------------
  // 3. /menu page showing updated price / product
  // ----------------------------------------------------
  console.log('Step 3: Checking /menu for updated product...');
  await page.goto('http://localhost:3000/menu', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelectorAll('h3').length > 5, { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '03-menu-product-updated.png') });
  console.log('✓ Saved 03-menu-product-updated.png');

  // ----------------------------------------------------
  // 4. Fill in /booking form until it succeeds
  // ----------------------------------------------------
  console.log('Step 4: Filling /booking form...');
  await page.goto('http://localhost:3000/booking', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.waitForSelector('#fullName', { timeout: 15000 });

  await page.click('#fullName');
  await page.type('#fullName', 'Farhan Ramadhan', { delay: 25 });

  await page.click('#whatsapp');
  await page.type('#whatsapp', '081288991122', { delay: 25 });

  await page.focus('#date');
  await page.keyboard.type('18102026');

  await page.select('#time', '16:00 WIB');

  // Party size: 4
  const partyButtons = await page.$$('button');
  for (const btn of partyButtons) {
    const text = await page.evaluate(el => el.textContent.trim(), btn);
    if (text === '4') {
      await btn.click();
      break;
    }
  }

  await page.type('#notes', 'Dekat area tanaman hijau untuk meeting santai.');
  await new Promise(r => setTimeout(r, 600));

  // Submit booking form
  const bookingSubmitBtn = await page.$('button[type="submit"]');
  if (bookingSubmitBtn) {
    await bookingSubmitBtn.click();
  }

  // Wait for confirmation card
  await page.waitForSelector('#confirmation-card', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '04-booking-form-success.png') });
  console.log('✓ Saved 04-booking-form-success.png');

  // ----------------------------------------------------
  // 5. Admin Bookings showing the new booking (Pending)
  // ----------------------------------------------------
  console.log('Step 5: Viewing /admin/bookings with new booking...');
  await page.goto('http://localhost:3000/admin/bookings', { waitUntil: 'networkidle0' });
  await page.waitForSelector('table tbody tr', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '05-admin-bookings-new-entry.png') });
  console.log('✓ Saved 05-admin-bookings-new-entry.png');

  // ----------------------------------------------------
  // 6. Admin Bookings change status to Confirmed
  // ----------------------------------------------------
  console.log('Step 6: Changing booking status to Confirmed...');
  const firstStatusSelect = await page.$('table tbody tr select');
  if (firstStatusSelect) {
    await firstStatusSelect.select('confirmed');
    await new Promise(r => setTimeout(r, 2500));
  }
  await page.screenshot({ path: path.join(OUTPUT_DIR, '06-admin-bookings-status-confirmed.png') });
  console.log('✓ Saved 06-admin-bookings-status-confirmed.png');

  await browser.close();
  console.log('🎉 All 6 UI screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Error in capture:', err);
  process.exit(1);
});
