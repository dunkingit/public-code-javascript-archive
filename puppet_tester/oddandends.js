const puppeteer = require("puppeteer");
const fs = require("fs")
const li = require("./getAllLinksOnPage")


// try()catch(){}
async function launchPuppet(){
    try{
        return await puppeteer.launch();
    }catch(error){
        console.log("failed to launch puppeteer")
        throw error
    }
}


async function getLinks(page){
    const links = await page.$$eval('a', (element)=>
element.map((element) => ({
    href: element.href,
    text: element.text
})
))  
    return links
};

async function getImages(page){
    const ele = await page.$$eval('img', (elements)=>
elements.map((element) => ({
    src: element.src,
    alt: element.alt
})
))
return ele

};


let testForPictureExtension = async (param) => /.*\.(jpg|png|svg|gif)$/.test(param);



async function getPictureObject(param){
    const matches = /(.*)\.(jpg|png|svg|gif)$/.exec(param);
    if (matches && (matches.length >= 0)) {
      const original = matches[0]  
      const pictureName = matches[1]  
      const pictureExtension = matches[2];
      return {
        original,
        pictureName,
        pictureExtension
      }
    }
    return false
}


async function getAllOnPageImagesByExtension(){
    const browser = await puppeteer.launch({headless:false});

    const page = await browser.newPage();
    let urls = []

    let counter = 0;
    await page.on('response', async (response) => {
    urls.push(response.url())
    });

    await page.goto('', {waitUntil: 'networkidle0'}); 
    urls.push(...await li.getAllLinks(page))
    await browser.close();
    urls = Array.from(new Set(urls))

    await fs.writeFile("testurls.json", JSON.stringify(urls), (err) => console.log(err))
  }
getAllOnPageImagesByExtension()






// async function getAllOnPageImagesByExtension(){
//     const browser = await puppeteer.launch();

//     const closeTimeout = setTimeout(async () => {
//         console.log("Puppeteer tests timed out after 60s");
//         process.exitCode = 2;
//         await closeBrowser(browser);
//        }, 60 * 1000);

//     const page = await browser.newPage();

//     let counter = 0;
//     await page.on('response', async (response) => {
//     console.log(response.url())
//     // if(!testForPicture(response.url())){
//     //     return
//     // }
//     const pictureObject = await getPictureObject(response.url());
//     // if(!pictureObject){
//     // return
//     // }
//     const buffer = await response.buffer();
//     const filename = `./images/image-${counter}.${pictureObject.pictureExtension}`
//     await fs.writeFile(filename, buffer, 'base64', (err) => console.error(err))
//     counter += 1;
//     });

//     await page.goto('https://anime-pictures.net/'); 
//     await browser.close();
//   }



// const closeTimeout = setTimeout(async () => {
//     console.log("Puppeteer tests timed out after 60s");
//     process.exitCode = 2;
//     // await closeBrowser(browser);
//     await browser.close()
//    }, 60 * 1000);


// let counter = 0;
// await page.on('response', async (response) => {
// const pictureObject = await checkForPicture(response.url());
// if(!pictureObject){
// return
// }
// const buffer = await response.buffer();
// const filename = `./image-${counter}.${pictureObject.pictureExtension}`
// await fs.writeFile(filename, buffer, 'base64', (err) => console.error(err))
// counter += 1;
// });

// page.on('request', (request) => {
//     if (/\.(png|jpg|jpeg|gif|webp)$/i.test(request.url)) {
//       request.abort();
//     } else if (request.url.startsWith(defaults.URL_INSTAGRAM_GRAPHQL_QUERY)) {
//       query_id = request.url.split('=')[1].split('&')[0];
//     } else {
//       request.continue();
//     }
//   });// async function getAllOnPageImagesByExtension(){
//     const browser = await puppeteer.launch();

//     const closeTimeout = setTimeout(async () => {
//         console.log("Puppeteer tests timed out after 60s");
//         process.exitCode = 2;
//         await closeBrowser(browser);
//        }, 60 * 1000);

//     const page = await browser.newPage();

//     let counter = 0;
//     await page.on('response', async (response) => {
//     console.log(response.url())
//     // if(!testForPicture(response.url())){
//     //     return
//     // }
//     const pictureObject = await getPictureObject(response.url());
//     // if(!pictureObject){
//     // return
//     // }
//     const buffer = await response.buffer();
//     const filename = `./images/image-${counter}.${pictureObject.pictureExtension}`
//     await fs.writeFile(filename, buffer, 'base64', (err) => console.error(err))
//     counter += 1;
//     });

//     await page.goto('https://anime-pictures.net/'); 
//     await browser.close();
//   }



// const closeTimeout = setTimeout(async () => {
//     console.log("Puppeteer tests timed out after 60s");
//     process.exitCode = 2;
//     // await closeBrowser(browser);
//     await browser.close()
//    }, 60 * 1000);


// let counter = 0;
// await page.on('response', async (response) => {
// const pictureObject = await checkForPicture(response.url());
// if(!pictureObject){
// return
// }
// const buffer = await response.buffer();
// const filename = `./image-${counter}.${pictureObject.pictureExtension}`
// await fs.writeFile(filename, buffer, 'base64', (err) => console.error(err))
// counter += 1;
// });

// page.on('request', (request) => {
//     if (/\.(png|jpg|jpeg|gif|webp)$/i.test(request.url)) {
//       request.abort();
//     } else if (request.url.startsWith(defaults.URL_INSTAGRAM_GRAPHQL_QUERY)) {
//       query_id = request.url.split('=')[1].split('&')[0];
//     } else {
//       request.continue();
//     }
//   });