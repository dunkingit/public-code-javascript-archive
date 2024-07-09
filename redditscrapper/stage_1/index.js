const puppeteer = require("puppeteer");
const fs = require("fs");
const { del, get } = require("request");
const { url } = require("inspector");
const { all } = require("axios");
const { json } = require("stream/consumers");

let finished
let allLinksUnsorted
let failUrls
let posts
let allCommentLinks

finished = new Set(JSON.parse(fs.readFileSync("finished.json", "utf-8")))
allLinksUnsorted = new Set(JSON.parse(fs.readFileSync(`all_links_unsorted.json`, 'utf8')))
failUrls = new Set(JSON.parse(fs.readFileSync(`links_failed.json`, 'utf8')))
posts = new Set(JSON.parse(fs.readFileSync(`posts.json`, 'utf8')))
allCommentLinks = new Set(JSON.parse( fs.readFileSync(`all_commenet_links.json`, 'utf8')))
let arrayOfFileNames = [`all_links_unsorted`, "textFile", `links_failed`, `finished`, "posts", `all_commenet_links`]

async function writeAll(){
    await writejson(`all_links_unsorted`,  Array.from(allLinksUnsorted))
    await writejson(`links_failed`, Array.from(failUrls))
    await writejson(`finished`, Array.from(finished))
    await writejson("posts", Array.from(posts))
    await writejson(`all_commenet_links`, Array.from(allCommentLinks))
}


async function fileManager(){
    let arrayOfFileNames = [`all_links_unsorted`, `links_failed`, `finished`, "posts", `all_commenet_links`]
    for(let file of arrayOfFileNames){
        if (fs.existsSync(`${file}.json`)) {
            console.log(`File Exists ${file}`)
          }
        else{
            console.log(`Creating file ${file}`)
            writejson(file, [])
        }
    }
}

async function readJson(name){
    let filename = !name.includes(".json")? `${name}.json`:name
    if (fs.existsSync(filename)) {
        console.log(`File Exists ${filename}`)
        return await JSON.parse(fs.readFileSync(filename, "utf-8"))
      }
    else{
        console.log(`Creating file ${filename}`)
        writejson(file, [])
    }
}



async function delay(time) {
    return new Promise(function(resolve) {
      setTimeout(resolve, time);
    });
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  
async function writejson(name, outputData){
    let filename = !name.includes(".json")? `${name}.json`:name
    const outputJSON = JSON.stringify(outputData);
    fs.writeFileSync(filename, outputJSON)
}

async function eval_getAllLinks(page){
    return await page.evaluate(() => {
        return Array.from(document.querySelectorAll("*")).map(element => element.href).filter(href => href); 
    })};


async function eval_scroll_down_other(page) {
    await page.evaluate(() => {

        function clickMoreComments(){
            let cl = "button-small px-[var(--rem10)] button-brand items-center justify-center button inline-flex"
            let items = document.getElementsByClassName(cl)
            if(items){
                for(let each of items){
                try{each.click()}catch(err){console.log(err)};//for loop close
                };//end of for
            }//end if
        }

        function clicker(){
            let face = "faceplate-partial"
            let arr = Array.from(document.getElementsByTagName(face))    
            while(arr){
            try{
                if(arr.length == 0){
                    break;
                }
                console.log(arr.length)        
                let element = arr.pop()
                if (element.innerText.includes("replies") || element.innerText.includes("reply")) {
                    element.click()
                }
            }catch(err){}
        }//End of while
        }//End of the function
        

        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                const maxScroll = document.body.scrollHeight - window.innerHeight;
                window.scrollBy(0, 100);
                clickMoreComments()
                clicker()
                if (window.scrollY >= maxScroll) {
                    clearInterval(interval);
                    resolve();  // Resolve the promise to indicate completion
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
}


async function redditSearchUrls(subreddit){
    const searchTerms = ["job", "career", "employment", "employ", "hire", "hiring", "indeed", "laid off", "laid", "hustle", "gig", "work", "recruit", "per hour", "salary", "indeed",
        "linkedin", "software", "dev", "job fair", "full time", "part time"]
    // const searchTerms = ["job"]
    const query = "search/?q="
    const netlock = "www.reddit.com"
    const schema = "https://"
    const path = "/r/" + `${subreddit}/` + query
    const searchRedditQueryUrl = schema + netlock + path
    const array = searchTerms.map(cu => searchRedditQueryUrl + cu)
    return array
}

async function failed(err, param, url){
    let text = `\n${err}\n\n----------------------------------\n${param}\n----------------------------------\n\m`
    console.log(text)
    failUrls.add(url)
}

async function getWork(page, param){
    try{
        return await Array.from(new Set(await param(page)))
    }catch(err){
        await failed(`${param} failed`, err)
    }
}

async function redditSearchPageGetPosts(page, url){
    try{
        await page.goto(url, {waitUntil: 'networkidle2'});
        await eval_scroll_down(page)
        await delay(5000)
        return await getWork(page, eval_getAllLinks)
    }catch(err){
        failed(err, "redditSearchPageGetPosts", url)
    }
}


async function iterAndPlaceIntoSet(iter, qualify, qualifiedSet, allSet){
    for(let each of iter){
        if(each && each.length > 0){
            if(link.includes(qualify)){
                qualifiedSet.add(link)
            }
            allSet.add(link)
        };
    };
}



async function getRedditSearchLinksQualifyIter(page, arrayOfLinksToCheck){
    console.log("Start step 3 -  getRedditSearchLinksQualifyIter")
    let counter = 0
    for (let url of arrayOfLinksToCheck){
        console.log(`Getting url: ${url} Loop number: ${counter + 1}`)
        try{
            let array = await redditSearchPageGetPosts(page, url)
            if(array){
                console.log(`Succeeded in getting ${url}`)
                finished.add(url)
                await iterAndPlaceIntoSet(array, "/comments", posts, allLinksUnsorted)
            }
        }catch(err){
            await failed(err, "Failed Getting Search Links Results\nFunction redditSearchPage", url)
        }
        counter++
        await writeAll()
    }
    console.log("end step 3 -  getRedditSearchLinksQualifyIter")
}




async function startup(){
    await fileManager()
    await console.clear()
}

async function setupSearchLinks(){
    const searchedLinks = new Set(await readJson("finished_search_links"))
    const arrayOfRedditSearchPageUrls =  await redditSearchUrls("columbus");
    console.log("Step 1 Complete - Array of main urls")
    const arrayOfRedditSearchPageUrlsFiltered = arrayOfRedditSearchPageUrls.filter(cu => !searchedLinks.has(cu))
    console.log(arrayOfRedditSearchPageUrlsFiltered)
    console.log("Step 2 Complete - Filtered array of main urls")
    return arrayOfRedditSearchPageUrlsFiltered
}


async function main() {
    await startup()

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    let arrayOfRedditSearchPageUrlsFiltered = await setupSearchLinks()
    if(arrayOfRedditSearchPageUrlsFiltered){
        console.log(`arrayOfRedditSearchPageUrlsFiltered: ${arrayOfRedditSearchPageUrlsFiltered.length}`)
        await getRedditSearchLinksQualifyIter(page, arrayOfRedditSearchPageUrlsFiltered)
    }

    // getRedditSearchLinksQualifyIter(page, arrayOfRedditSearchPageUrlsFiltered)
    // getPostsCommentLinks(page)
    await browser.close();
}

//"https://www.reddit.com/r/columbus/search/?q=job", 
main()
