const puppeteer = require("puppeteer");
const fs = require("fs");
const { del, get } = require("request");
const { url } = require("inspector");
const { all } = require("axios");
const { json } = require("stream/consumers");
const { stringify } = require("querystring");
const e = require("express");
const { title } = require("process");

// function getEventNames(){
// 	let array = Array.from(document.getElementsByClassName("event-card-link")).map(x => x.innerText).filter(x => x && x.length > 0)
// 	let newset = new Set(array)
// 	return Array.from(newset)

// }


// console.log(getEventNames())



// function getEventNames() {
//     let elements = Array.from(document.getElementsByClassName("Stack_root__1ksk7"));
//     let array = elements.map(x => x.innerText.trim()).filter(x => x && x.length > 0);
//     let newSet = new Set(array);
// 	let testobjects = []

//     for (let each of elements) {
//         let childNodes = each.childNodes;
// 		let obj = {}
//         let text = "{\n";
//         for (let node of childNodes) {
//             if (node.nodeType === Node.TEXT_NODE) {
//                 text += node.textContent.trim();
//             } else if (node.nodeType === Node.ELEMENT_NODE) {
//                 let attributes = Array.from(node.attributes);
//                 for (let attr of attributes) {
//                     text += `${attr.name}: ${attr.value},\n`;
// 					obj[attr.name] = attr.value
//                 }
//             }
//         }
// 		text += "\n}"
// 		testobjects.push(obj)
//         newSet.add(text.trim());
//     }
// 	console.log(testobjects)
//     return Array.from(newSet);
// }

// console.log(getEventNames());


async function eval_scroll_down_other(page) {
    return await page.evaluate(() => {
        let array = [];


        function getEventNames() {
            let elements = Array.from(document.getElementsByClassName("Stack_root__1ksk7"));
            let array = elements.map(x => x.innerText.trim()).filter(x => x && x.length > 0);
            let newSet = new Set(array);
            let testobjects = []
        
            for (let each of elements) {
                let childNodes = each.childNodes;
                let obj = {}
                let text = "{\n";
                let mainText = ""
                for (let node of childNodes) {
                    mainText += node.innerText.includes(",")? node.innerText:node.innerText + ","
                    
                    if (node.nodeType === Node.TEXT_NODE) {
                        text += node.textContent.trim();
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        let attributes = Array.from(node.attributes);
                        for (let attr of attributes) {
                            text += `${attr.name}: ${attr.value},\n`;
                            obj[attr.name] = attr.value
                        }
                    }
                }
                text += "\n}"
                obj["mainText"] = mainText
                testobjects.push(obj)
                newSet.add(text.trim());
            }
            return testobjects;
        }
        // console.log(getEventNames());


        function getarray(){
            return Array.from(document.getElementsByClassName("event-card-link")).map(x => x.attributes).map(x => x["aria-label"].nodeValue)
        }

        return new Promise((resolve, reject) => {


            const interval = setInterval(() => {
                const maxScroll = document.body.scrollHeight - window.innerHeight;
                window.scrollBy(0, 100);
                let temparray = getEventNames()
                array.push(...temparray)
                if (window.scrollY >= maxScroll) {
                    clearInterval(interval);
                    resolve(array);  // Resolve the promise with the array
                }
            }, 500);
        });
    });
}


async function eval_scroll_down(page) {
    await page.evaluate(() => {
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                const maxScroll = document.body.scrollHeight - window.innerHeight;
                window.scrollBy(0, 100);
                if (window.scrollY >= maxScroll) {
                    clearInterval(interval);
                    resolve();  // Resolve the promise to indicate completion
                }
            }, 3000);
        });
    });

    return true;
}

async function eval_getAllLinks(page){
    return await page.evaluate(() => {
        return Array.from(document.querySelectorAll("*")).map(element => element.href).filter(href => href); 
    })};

    async function eval_getTagLines(page){
        return await page.evaluate(() => {
            function getEventNames(){
                return Array.from(document.getElementsByClassName("event-card-link")).map(x => x.attributes).map(x => x["aria-label"].nodeValue)
            }
            return getEventNames()
        })};

async function readJsonFile(filePath) {
    try {
        const data = await fs.readFileSync(`${filePath}.json`, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading file from disk: ${err}`);
        // Assuming we want to return an empty array if the file doesn't exist or any error occurs
        return [];
    }
  }
  
  // Asynchronously writes an object or array to a JSON file
  async function writeJson(filePath, data) {
    try {
        const jsonData = JSON.stringify(data, null, 2); // Beautify the JSON output
        await fs.writeFileSync(`${filePath}.json`, jsonData, 'utf8');
    } catch (err) {
        console.error(`Error writing file to disk: ${err}`);
    }
  }
  
  async function browse(page, url){
    console.log(url)
    try {
        await page.goto(url, {waitUntil: 'networkidle0', timeout: 60000});
      } catch (error) {
        console.error('Page load timed out, handling error');
        console.log(error)
        console.log(`URL Failed: ${url}`)
      }
}

async function main() {
    let site = ""
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    let tempset = new Set([])

    for(let i = 1; i < 51; i++){
        let newurl = site + i
        console.log(`Getting ${newurl}`)
        try{
            await page.goto(newurl, {waitUntil: 'networkidle0', timeout: 60000});
            const temp = await eval_scroll_down_other(page).then(x => tempset.add(x))
            console.log(tempset)
        }catch(error){
            console.log(error)
        }

    }

    await writeJson("all titles objects", Array.from(tempset))
    await browser.close();
}

main()