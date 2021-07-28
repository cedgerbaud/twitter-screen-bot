import puppeteer from 'puppeteer';

async function screenTweet(url: string, tweetId: string): Promise<void> {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto(url, { waitUntil: 'networkidle2' })
  page.setViewport({width: 1000, height: 1500, deviceScaleFactor: 1});
  await page.waitForSelector('article')
  
  const element = await page.$('article')
  if (!element) throw new Error('Tweet not found on the browser')

  await element.screenshot({ path: `screenshots/${tweetId}.png` })
  
  await browser.close()
}

export default screenTweet;
