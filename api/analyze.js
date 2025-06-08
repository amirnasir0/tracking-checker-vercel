import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export default async function handler(req, res) {
  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      defaultViewport: chromium.defaultViewport,
      ignoreHTTPSErrors: true
    });

    const page = await browser.newPage();
    await page.goto('https://example.com', { waitUntil: 'domcontentloaded' });
    const title = await page.title();

    await browser.close();
    return res.status(200).json({ success: true, title });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Failed to launch browser',
      reason: err.message
    });
  }
}
