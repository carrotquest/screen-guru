'use strict';

const sharp = require('sharp');
const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

const quantcastCleaner = require('./utils/cleaners/quantcast');
const bannerCleaner = require('./utils/cleaners/banner');

module.exports.screenshot = async (event, context, callback) => {
  let browser = null;
  console.log('---------------------')
  console.log(chromium.args)
  console.log('---------------------')
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    let page = await browser.newPage();
  
    const logPrefix = event.queryStringParameters && event.queryStringParameters.url
      ? `LOG: {"url":"${event.queryStringParameters.url}"`
      : `LOG: {"url":"unknown"`;
    page
      .on('pageerror', ({ message }) =>
        console.log(`${logPrefix} Page Error: `, message))
      .on('response', response => {
        console.info(response.status().toString(), response.status.toString().startsWith('2'))
        if (!response.status().toString().startsWith('2')) {
          console.log(`${logPrefix} Response: ${response.status()} ${response.url()}`);
        }
      })
      .on('requestfailed', request =>{
        console.log(`${logPrefix} Request Failed: ${request.failure()?.errorText} ${request.url()}`)
      })

    let url = 'https://www.carrotquest.io/';
	let screen_height = 600;
	let screen_width = 800;

    if (event.queryStringParameters && event.queryStringParameters.url) {
      url = decodeURIComponent(event.queryStringParameters.url);

      if (!url.startsWith('http')) {
        url = 'http://' + url;
      }
    }

	if (event.queryStringParameters && event.queryStringParameters.height) {
      screen_height = parseInt(event.queryStringParameters.height);
    }
	
	if (event.queryStringParameters && event.queryStringParameters.width) {
      screen_width = parseInt(event.queryStringParameters.width);
    }

    await page.setViewport({ width: screen_width, height: screen_height });
    await page.goto(url, { waitUntil: 'networkidle0' });

    const cleaners = [bannerCleaner, quantcastCleaner];

    let elementRemoved = false;
    cleaners.forEach(async cleaner => {
      if (!elementRemoved) {
        elementRemoved = await page.evaluate(cleaner);
      }
    });

    await page._client.send('Animation.setPlaybackRate', { playbackRate: 20 });
    await page.waitFor(500);

    const screenshot = await page.screenshot();
    await browser.close();

	let image = sharp(screenshot);
    const buffer = await image.toBuffer();

    callback(null, {
      statusCode: 200,
      isBase64Encoded: true,
      body: buffer.toString('base64'),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'image/png',
        'Cache-Control': 'max-age=60',
      },
    });
  } catch (error) {
    callback(error);
  }
};
