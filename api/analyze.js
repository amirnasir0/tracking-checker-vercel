import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export default async function handler(req, res) {
  // ... validation code

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true
    });
    // ... your page logic ...
    await browser.close();
    return res.json(result);
  } catch (e) {
    console.error('Invocation error:', e);
    return res.status(500).json({ error: 'Puppeteer invocation failed', reason: e.message });
  }
}
