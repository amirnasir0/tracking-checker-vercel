import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export default async function handler(req, res) {
  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      defaultViewport: chromium.defaultViewport,
      ignoreDefaultArgs: ['--disable-extensions']
    });

    const page = await browser.newPage();
    await page.goto('https://example.com');
    const title = await page.title();
    await browser.close();

    return res.status(200).json({ success: true, title });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      error: 'Failed to launch browser',
      details: e.message
    });
  }
}
