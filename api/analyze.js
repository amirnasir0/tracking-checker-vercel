import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Only POST allowed');
  }

  const { url } = req.body;
  if (!url || !/^https?:\/\//.test(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless
    });

    const page = await browser.newPage();
    const trackerHits = [], proxyHits = [];

    page.on('request', req => {
      const rurl = req.url();
      if (rurl.includes('facebook.com/tr') || rurl.includes('google-analytics.com') || rurl.includes('clarity.ms')) {
        trackerHits.push(rurl);
      }
      if (rurl.match(/\\/track|\\/collect|gtm\\./)) {
        proxyHits.push(rurl);
      }
    });

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    const cookies = await page.cookies();
    await browser.close();

    const result = {
      has_tracker_script: trackerHits.length > 0,
      has_proxy_endpoint: proxyHits.length > 0,
      tracking_cookies: cookies.filter(c => ['_ga', '_fbp', '_gid'].includes(c.name)),
      tracking_status: '',
      detail: ''
    };

    if (result.has_tracker_script && result.has_proxy_endpoint) {
      result.tracking_status = 'hybrid';
      result.detail = 'Hybrid tracking detected.';
    } else if (result.has_tracker_script) {
      result.tracking_status = 'browser';
      result.detail = 'Browser-side tracking detected.';
    } else if (result.has_proxy_endpoint) {
      result.tracking_status = 'server';
      result.detail = 'Server-side tracking detected.';
    } else {
      result.tracking_status = 'none';
      result.detail = 'No tracking detected.';
    }

    res.status(200).json(result);
  } catch (e) {
    console.error('Function error:', e.message);
    res.status(500).json({ error: 'Function failed.', reason: e.message });
  }
}
