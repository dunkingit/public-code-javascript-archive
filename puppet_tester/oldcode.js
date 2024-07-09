// Old code for basic scraping

// const puppeteer = require("puppeteer");
// const fs = require("fs")
// const gl = require('./getAllLinksOnPage.js');
// const se = require('./screenshotElements.js');

// async function run() {
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();
//     await page.goto("https://www.programiz.com/rust/data-types");
//     const title = await page.title()
//     const links = await gl.getLinks(page)
//     const images = await gl.getImages(page)

//     // Take counts of the images and links
//     const imageCount = images.length;
//     const linkCount  = links.length;

//     const outputData = {
//     title,
//     images ,
//     links,
//     imageCount ,
//     linkCount
//     }


//     const outputJSON = JSON.stringify(outputData);
//     fs.writeFileSync('output.json', outputJSON)

//     await browser.close();
// }

// run();


// const ele = await page.$$eval('meta', (element)=>
// element.map((element) => ({
//     2: element.name,
//     3: element.content,
//     4: element.textContent
// })
// )

// )

    // const returnedLinks = await gl.getLinks(page)
    // console.log(returnedLinks)
    // await page.screenshot({ path: 'test.png' });
    // await page.pdf({ path: 'testpdf.pdf', format: 'A4' });

// ------------------------------------
// Scroll entire page using node

    // await page.evaluate(async () => {
    //     await new Promise((resolve, reject) => {
    //         var totalHeight = 0;
    //         var distance = 100; // Should be less than or equal to window.innerHeight
    //         var timer = setInterval(() => {
    //             var scrollHeight = document.body.scrollHeight;
    //             window.scrollBy(0, distance);
    //             totalHeight += distance;

    //             if(totalHeight >= scrollHeight){
    //                 clearInterval(timer);
    //                 resolve();
    //             }
    //         }, 10);
    //     });
    // });
// ------------------------------------




// other additonal Code


const puppeteer = require("puppeteer");
const fs = require("fs")
const device = puppeteer.KnownDevices['iPhone 13 Pro Max'];
const gl = require('./getAllLinksOnPage.js');
const se = require('./screenshotElements.js');

async function run() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("");
    const title = await page.title()
    const links = await gl.getLinks(page)
    const images = await gl.getImages(page)

    // Take counts of the images and links
    const imageCount = images.length;
    const linkCount  = links.length;

    const outputData = {
    title,
    images ,
    links,
    imageCount ,
    linkCount
    }


    const outputJSON = JSON.stringify(outputData);
    fs.writeFileSync('output.json', outputJSON)

    await browser.close();
}

run();