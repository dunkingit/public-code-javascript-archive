const { response } = require("express");
const fs = require("fs")
const puppeteer = require("puppeteer");
const PuppeteerHar = require('puppeteer-har');
const exec = require('child_process');
const { del } = require("request");

async function setupDownload(page, downloadPath) {
  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadPath,
  });
}

async function downloadFile(page, url, path) {
    console.clear()
    const response = await page.goto(url, {waitUntil: 'networkidle2'});
    console.log(`${response.errorText}`)
    try{
      const buffer = await response.buffer();
      fs.writeFileSync(path, buffer);
    }catch(err){
      console.log(err)
    }
  }


async function downloadFile(page, url, path) {
    const response = await page.goto(url, {waitUntil: 'networkidle2'});
    const buffer = await response.buffer();
    fs.writeFileSync(path, buffer);
  }

async function setupDownload(page, downloadPath) {
  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadPath,
  });
}


// Usage
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await setupDownload(page, '/path/to/download');
  
    // Now, when you navigate to a page and trigger a download,
    // the file will be saved to the specified directory.
  })();



  (async () => {
    const browser = await puppeteer.launch({headless: false}); // Downloads may not work properly in headless mode for some versions
    const page = await browser.newPage();
  
    // Listen for download events
    page.on('download', async (download) => {
      // Specify the path and save the file
      await download.saveAs('/path/to/download/' + download.suggestedFilename());
      // Or you can simply get the path where it's temporarily saved
      const path = await download.path();
      console.log(`File downloaded and saved to ${path}`);
    });
  
    // Trigger the download on the page, for example, by clicking a download link
    await page.goto('https://example.com');
    await page.click('#downloadButton'); // Adjust selector to your needs
  })();
  
  async function iter(){
    for (let each of arraySet){
      // await downloadFile(page, each, "C:\\Users\\Mainster\\Music\\temp download")
      console.log(each)
    }
  }