const puppeteer = require("puppeteer");
const fs = require("fs");
const { del, get } = require("request");
const { url } = require("inspector");
const { all } = require("axios");
const { json } = require("stream/consumers");
const { stringify } = require("querystring");
const e = require("express");
const { title } = require("process");

let allLinksUnsorted  = new Set(JSON.parse(fs.readFileSync(`all_links_unsorted.json`, 'utf8')))
let myEventLogger = {}



async function eventLogger(event, myEventLogger){
    let num = Object.keys(myEventLogger).length + 1;
    myEventLogger[num] = event
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
        let j = await JSON.parse(await fs.readFileSync(filename))
        console.log(j)
        return j
      }
    else{
        console.log(`Creating file ${filename}`)
        await writejson(filename, [])
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
    fs.writeFileSync(filename, outputJSON, "utf-8")
}



//////////////////////////// Eval functions
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

            }, 1500);
        });
    });

    return true;
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


////////////////////////////
////////////////////////////
////////////////////////////



async function getJsonFromUrl(page){
    return await page.evaluate(() => {
        
        // function getJson(){
        //     try{return JSON.parse(document.body.innerText)}catch(err){return `errorread ${err}`}
        // }
        // return getJson
        return JSON.parse(document.body.innerText)
  });
}


async function getWork(page, param){
    try{
        return await Array.from(new Set(await param(page)))
    }catch(err){
        await console.log( `failed ${param}`)
    }
}


async function postUrl(page, alink){
    try{
        await page.goto(alink, {waitUntil: 'networkidle2'});
        await eval_scroll_down_other(page)
        await delay(10000)
        return await getWork(page, eval_getAllLinks)
    }catch(err){
        console.log(`Failed postUrl: ${alink}`)
    }
}


async function iterAndPlaceIntoSet(iter, qualify, qualifiedSet){
    for(let each of iter){
        if(each && each.length > 0){
            if(link.includes(qualify)){
                qualifiedSet.add(link)
            }
        };
    };
}



//////////////search
async function generateSearchURLs({ netloc, subDirectory = 'r/columbus', schema = 'https://', queryBase = '/search/?q=' }) {
    const searchTerms = ["job", "career", "employment", "employ", "hire", "hiring", "indeed", "laid off", "laid", "hustle", "gig", "work", "recruit", "per hour", "salary", "indeed", "linkedin", "software", "dev", "job fair", "full time", "part time"];
    const urls = searchTerms.map(term => `${schema}${netloc}/${subDirectory}${queryBase}${term}`);
    return urls;
}


async function redditSearchPageGetPosts(page, url){
    try{
        await page.goto(url, {waitUntil: 'networkidle2'});
        await eval_scroll_down(page)
        await delay(5000)
        return await getWork(page, eval_getAllLinks)
    }catch(err){
        console.log("Failed " + url)
    }
}

async function iterIntoSet(param, aset){
    for(let each of param){
        aset.add(each)
    }

}


async function getRedditSearchLinksQualifyIter(page, arrayOfLinksToCheck){
    
    console.log("Start -  getRedditSearchLinksQualifyIter")
    const finishedSearchLinks = new Set(await readJson("finishedSearchLinks"))
    let failedSearchLinks = new Set(await readJson("failedSearchLinks"))
    let posts = new Set(JSON.parse(fs.readFileSync(`posts.json`, 'utf8')))
    console.log("Finished -  loading method jsons")
    let arrayToIter = arrayOfLinksToCheck.filter(x => !finishedSearchLinks.includes(x))


    let counter = 0
    for (let url of arrayToIter){
        console.log(`Getting url: ${url} Loop number: ${counter + 1}`)
        try{
            let array = await redditSearchPageGetPosts(page, url)
            if(array){
                console.log(`Succeeded in getting ${url}`)
                await iterIntoSet(array, allLinksUnsorted)
                await iterAndPlaceIntoSet(array, "/comments", posts)
                finishedSearchLinks.add(url)
            }else{
                failedSearchLinks.add(url)
            }

        }catch(err){
            failedSearchLinks.add(url)
        }
        counter++

        await writejson("allLinksUnsorted", Array.from(allLinksUnsorted))
        await writejson("finishedSearchLinks", Array.from(finishedSearchLinks))
        await writejson("failedSearchLinks", Array.from(failedSearchLinks))
        await writejson("posts", Array.from(posts))
    }
    console.log("end step 3 -  getRedditSearchLinksQualifyIter")
}
async function stringy(someText){
    return someText.replace(/(\r\n|\n|\r)/gm, "");
}

async function setupSearchLinks(){
    const finishedSearchLinks = new Set(await readJson("finishedSearchLinks"))
    const arrayOfWebsiteSearchPageUrls =  await generateSearchURLs({netloc: "www.reddit.com"});
    console.log("Step 1 Complete - Array of main urls")
    const arrayOfWebsiteSearchPageUrlsFiltered = arrayOfWebsiteSearchPageUrls.filter(cu => !finishedSearchLinks.has(cu))
    console.log("Step 2 Complete - Filtered array of main urls")
    console.log(arrayOfWebsiteSearchPageUrlsFiltered)
    return arrayOfWebsiteSearchPageUrlsFiltered
}



async function filterSpecial(array, text, finished){
    return array.filter(cu => {
        if(each && each.length > 1 && each.includes(text) && !finished.has(each)){
         return cu
        }
     })
}




///////////////part 2
async function getPostsCommentLinks(page){

    console.log("Starting getPostsCommentLinks")

    let finishedPostLinks = new Set(await readJson("finishedPostLinks"))
    let finished = new Set(await readJson("finished"))
    let failedPostLinks = new Set(await readJson("failedPostLinks"))
    let posts = new Set(await readJson(`posts.json`))
    let allCommentLinks = new Set(JSON.parse( fs.readFileSync(`all_commenet_links.json`, 'utf8')))
    let arrayOfPostLinksToSearch = Array.from(posts).filter(cu => !finishedPostLinks.has(cu) && !finished.has(cu))

    let counter = 0
    for(let url of arrayOfPostLinksToSearch){
        counter++
        console.log(`Getting ${counter} out of ${arrayOfPostLinksToSearch.length}`)
        console.log(url)
        try{
            let commentLinks = await postUrl(page, url)
            if(commentLinks){
                await iterIntoSet(commentLinks, allLinksUnsorted)
                await iterAndPlaceIntoSet(commentLinks, "/comment/", allCommentLinks)
                finishedPostLinks.add(url)
            }else{
                failedPostLinks.add(url)
            }
        }catch(err){
            console.log(`failed ${url}`)
            failedPostLinks.add(url)
        }

        let arrays = {allLinksUnsorted, finishedPostLinks, failedPostLinks, allCommentLinks, posts}

        await writejson("allLinksUnsorted", Array.from(allLinksUnsorted))
        await writejson("finishedPostLinks", Array.from(finishedPostLinks))
        await writejson("failedPostLinks", Array.from(failedPostLinks))
        await writejson("all_commenet_links", Array.from(allCommentLinks))
        await writejson("posts", Array.from(posts))
    }
    console.log("Ending getPostsCommentLinks")
}



async function temp_getPostsCommentLinks(page, url){
    console.log(url)
    try{
        return await postUrl(page, url)
    }catch(err){
        console.log(`failed ${url}`)
    }
}



// function recursiveJsonObjects(item) {
//     // Handle dictionary-like objects
//     if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
//         try {
//             const newitem = item.data.children;
//             recursiveJsonObjects(newitem);
//         } catch (error) {
//             // Error handling or simply pass
//         }
//     }

//     // Handle list-like objects
//     if (Array.isArray(item)) {
//         item.forEach(each => {
//             try {
//                 const data = each.data;
//                 const body = data.body;
//                 testArray.push(body);
//                 const replies = data.replies;
//                 recursiveJsonObjects(replies);
//             } catch (error) {
//                 // Error handling or simply pass
//             }
//         });
//     }
// }


async function recursiveJsonObjects(item, testArray) {
    if (!item) return;

    if (typeof item === 'object' && item.data) {
        if (item.data.children) {
            recursiveJsonObjects(item.data.children, testArray);
        }

        if (item.data.body) {
            testArray.push(item.data.body);
        }

        if (item.data.replies) {
            recursiveJsonObjects(item.data.replies, testArray);
        }
    } else if (Array.isArray(item)) {
        item.forEach(entry => recursiveJsonObjects(entry, testArray));
    }
}

async function specialAddToObject(param){
    console.clear()
    let text = "-".repeat(40) + "\n".repeat(5) + JSON.stringify(param) + "\n".repeat(5) + "-".repeat(40)
    console.log(text)

}

let counter_a = 0

async function newtest(json) {
    let title = json[0].data.children[0].data.title || "None"
    let post = json[0].data.children[0].data.selftext || "None"
    let comments = [];
    await recursiveJsonObjects(json[1], comments);
    return {title, post, comments}
}



async function getComments(page, url){
    console.log(`Getting from within getcomments ${url}`)
    await page.goto(url, {waitUntil: 'networkidle2'});
    try{ 
        let jsonfile = await getJsonFromUrl(page)
        // if(Object.keys(jsonfile).includes('error')){

        // }
        return await newtest(jsonfile)
    }catch(err){
        console.log(err)
    }
}


async function startup(){
    await fileManager()
    await console.clear()
}


async function main() {
    console.clear()
    await startup()

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    // let arrayOfRedditSearchPageUrlsFiltered = await setupSearchLinks()
    // console.log(`Length of search page urls: ${arrayOfRedditSearchPageUrlsFiltered.length}`)
    // if(arrayOfRedditSearchPageUrlsFiltered){
    //     await getRedditSearchLinksQualifyIter(page, arrayOfRedditSearchPageUrlsFiltered)
    // }


    let specialFile = "specialTestCommentLinks"
    let testing = "https://www.reddit.com/r/Columbus/comments/1cnme4v/canes_prices_from_2012/"
    let tempLinks
    if (fs.existsSync(`${specialFile}.json`)) {
        tempLinks = await JSON.parse(fs.readFileSync(`${specialFile}.json`))
      }
    else{
        tempLinks = await temp_getPostsCommentLinks(page, testing)
        // await writejson(specialFile, tempLinks)
    }
    // tempLinks = await temp_getPostsCommentLinks(page, testing)


    let arrayOfObjects = []
    for(let each of newarray){
        console.log(`Getting: ${each}`)
        let postObj = await getComments(page, each)
        await delay(5000)
        if(postObj){
            let checkedObj = arrayOfObjects.filter(cu => cu && cu.title.includes(postObj.title))
            if(checkedObj.length == 0){

                arrayOfObjects.push(postObj)
                continue;
            }
            let comments = checkedObj[0].comments
            if(postObj.comments){
                comments.push(...postObj.comments)
                let temp = new Set(checkedObj[0].comments)
                checkedObj[0].comments = Array.from(temp)
            }
            await writejson("specialObjects", arrayOfObjects)
        }

    }

    await browser.close();
}




async function tester(){
    let json = await readJson("all_comment_links")
    let temp =  json.filter(cu => cu && cu.length > 0 && 
        !cu.includes("static") && 
        cu.includes("comment") &&
        cu.includes("comments") &&
        cu.includes("Columbus")
    ).map(cu => `${cu}.json`)
    console.log(temp)
    return temp
}

async function resultsIntoArray(param){
    let text = "let array = ["
    if(Array.isArray(param)){
        param.forEach(x => text += `"${x}", `)
    }
    text += " ];"
    return text
}


function enumerate(param){
    param = Array.from(param)
    for (const [index, element] of param.entries()) {
    console.log(index, element);}
}

function getPartOfLink(param){
    if(typeof param === 'string'){
        let schema = param.includes("https://")? "https://":
        param.includes("http://")? "http://":"";
        if(schema){
            let link = param.replace("https://", "")
            splitLink = link.split("/")
            partPath = splitLink[1]
            return partPath
        }
    }
}
  

function tester2(){

    let array = ["shreddit", "svc", "gsi", "login", "adsregister?utm_source=web3x_consumer&utm_name=user_menu_cta", "avatar", "store", "US", "user", "news", "article", "best", "LEGO-Island-VGF", "adsregister?utm_source=web3x_consumer&utm_name=left_nav_cta", "careers", "press", "posts", "topics", "policies"  ];
    console.clear()
    let sp = "1cnme4v"
    // let data = JSON.parse(fs.readFileSync("all_comment_links.json"))
    let data = JSON.parse(fs.readFileSync(`specialTestCommentLinks.json`))
    data = data.filter(x => x && x.length > 0)
    let test = "hello"
    console.log(test.split())
    // let data = await readJson("all_comment_links")

    const exclusionConditions = [
        item => !item.includes("static")
    ];
    
    const inclusionConditions = [
        item => item.includes("comment"),
        item => item.includes("comments"),
        item => item.includes("Columbus"),
        item => item.includes("1cnme4v")
    ];


    const Conditions = [
        item => !item.includes("Columbus"),
    ]
    
    // const result = data.filter(item => 
    //     exclusionConditions.every(cond => cond(item)) &&
    //     inclusionConditions.every(cond => cond(item))
    // );


        // inclusionConditions.every(cond => cond(item))
    // const result = data.filter(item => item && item.length > 0 && !item.includes("Columbus"));
    // const parts = new Set(result.map(x => getPartOfLink(x)).filter(x => x && x.length > 1))
    // const textArray = resultsIntoArray(Array.from(parts))
    // console.log(textArray)

}


tester2()













// let testurl = "https://www.reddit.com/r/Columbus/comments/xxybui/comment/irf0f8p/.json"


// {"message":"Too Many Requests","error":429}

// async function specialAddToObject(param){
//     let counter = 0

//     console.clear()

//     let text = "-".repeat(40) + "\n".repeat(5) + JSON.stringify(param) + "\n".repeat(5) + "-".repeat(40)
//     console.log(text)
//     try{
//         counter++
//         let test = param[0]
//         console.log(test)
//     }catch(err){
//         console.log(err)
//         console.log(`test: ${counter}`)
//     }

//     try{
//         counter++
//         let test = param[0].data
//         console.log(test)
//     }catch(err){
//         console.log(err)
//         console.log(`test: ${counter}`)
//     }

//     try{
//         counter++
//         let test = param[0].data.children
//         console.log(test)
//     }catch(err){
//         console.log(err)
//         console.log(`test: ${counter}`)
//     }


//     try{
//         counter++
//         let test = param[0].data.children[0]
//         console.log(test)
//     }catch(err){
//         console.log(err)
//         console.log(`test: ${counter}`)
//     }

//     try{
//         counter++
//         let test = param[0].data.children[0].data
//         console.log(test)
//     }catch(err){
//         console.log(err)
//         console.log(`test: ${counter}`)
//     }


//     try{
//         counter++
//         let test = param[0].data.children[0].data.title
//         console.log(test)
//     }catch(err){
//         console.log(err)
//         console.log(`test: ${counter}`)
//     }


// }


    // const te = [
    //     item => item + 2,
    //     item => item + 5
    // ];

    // let x = te.map(x => x(8))
    // console.log(x)