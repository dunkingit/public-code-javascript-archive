const puppeteer = require("puppeteer");
const fs = require("fs")
const gl = require('./getAllLinksOnPage.js');
const se = require('./screenshotElements.js');

async function run(url) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle0'});
    await page.focus("textarea[name='q']")
    await page.keyboard.type("Columbus weather")
    await page.waitForNetworkIdle()
    await page.keyboard.press('Enter')
    await page.waitForNetworkIdle()
    await browser.close();
}

run('https://google.com');
