import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST method allowed' });

  const { url } = req.body;
  if (!url || !/^https?:\/\//.test(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      defaultViewport: chromium.defaultViewport
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    const cookies = await page.cookies();
    await browser.close();

    return res.json({
      message: 'Puppeteer launched successfully!',
      sample_cookies: cookies.slice(0, 3)
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Puppeteer invocation failed',
      reason: err.message
    });
  }
}
