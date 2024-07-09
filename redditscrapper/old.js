
// async function downloadJson(url) {
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();
//     await page.goto(jsonUrl, { waitUntil: 'networkidle0' });
//     const jsonData = await page.evaluate(() => {return JSON.parse(document.body.innerText);});


//     const outputJSON = JSON.stringify(jsonData);
//     fs.writeFileSync('output.json', outputJSON)
//     await browser.close();
//     return jsonData;
// }

// Example usage
// downloadJson(testurl);


// function clicker() {
//     let foundButton = false;
//     let cl2 = "text-tone-2 text-12 no-underline hover:underline px-xs py-xs flex ml-[3px] xs:ml-0 !bg-transparent !border-0 invisible h-0 !p-0";
//     let arr = document.getElementsByClassName(cl2);    
//     for (let each of arr) {
//         try {
//             if (each.innerText.includes("replies") || each.innerText.includes("reply")) {
//                 console.log(each.innerText);
//                 each.click();
//                 foundButton = true;  
//             }
//         } catch (err) {
//             console.error(err);
//         }
//     }
//     // Enable this if you want recursive behavior
//     // if (foundButton) {
//     //     clicker();
//     // }
// }

// function text() {
//     let found = false;
//     let t = "md text-14 rounded-[8px] pb-2xs";
//     let textArray = document.getElementsByClassName(t);
//     for (let each of textArray) {
//         if (!allText.includes(each.innerText)) {
//             found = true;
//             allText.push(each.innerText);
//         }
//     }
//     return found;
// }


// async function eval_links(page){
//     let urls = Array.from(document.querySelectorAll("a")) // Changed to select only anchor tags
//     .map(element => element.href) // Map only elements with href
//     .filter(href => href && typeof href === 'string' && href.includes("/comments/")); 
// }












// async function eval_scroll_down(page) {
//     await page.evaluate(() => {
//         async function scrollToBottom() {
//             // Set an interval to scroll automatically every 100 milliseconds
//             const interval = await setInterval(() => {
//                 // Scroll to the bottom of the page
//                 window.scrollTo(0, document.body.scrollHeight);
        
//                 // Optional: Stop scrolling automatically when reaching the bottom
//                 // You might adjust this condition depending on the exact behavior you need
//                 if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
//                     clearInterval(interval);
//                     console.log('Reached the bottom');
//                 }
//             }, 100);
//         }
        
//         // Start scrolling
//         scrollToBottom();
        
// })}



// let testurl = "https://www.reddit.com/r/Columbus/comments/1bpto8u/comment/kwyqj65.json"

// main()

// await page.goto(jsonUrl, { waitUntil: 'networkidle0' });
// const jsonData = getJsonFromUrl(page)
// await page.goto(searchRedditQueryUrl, { waitUntil: 'networkidle0' });
// await eval_scroll_down(page)
// await delay(5000)
// let mainPosLinks = await eval_links(page)



//Still in for loop
// if(arrayOfUnmodifiedLinks){
//     try{

//         //Step 7: Seperate qualify urls
//         let qualifiedUrls = await eval_getAllLinks_includesComment(page)
//         task = "qualifiedUrls"
//         obj["modified urls"] = qualifiedUrls;

//         }catch(err){

//             await failed(`${task} failed`, err)
//             failUrls.push(url)

//         }
// }



    // try{
    //     //Step 5: Eval - get all links that are unmodified
    //     let links = Array.from(new Set(await eval_getAllLinks(page)))
    //     obj["all urls"] = getWork(page, eval_getAllLinks)
    // }catch(err){
    //     await failed(`Get All Links - failed`, err)
    //     failUrls.push(url)
    // }

    // try{
    //     //Step 5: Eval - get all links that are unmodified
    //     modLinks = Array.from(new Set(await eval_getAllLinks_includesComment(page)))
    //     obj["modified urls"] = modLinks
    //     }
    //     catch(err){
    //     await failed(`Mod Links Failed - failed`, err)
    //     failUrls.push(url)
    // }


    // function main(){
    //     let cl = "button-small px-[var(--rem10)] button-brand items-center justify-center button inline-flex "
    //     let items = document.getElementsByClassName(cl)
    // if(items){
    //     for(let each of items){
    //     try{
    //     each.click()
    // }catch(err){
    //     console.log(err)
    // console.log("Could not click this.")
    // }
    // }
    // }
    // }
    
    // main()
//////////////////////////////////////////////////
    // function clicker() {
    //     let foundButton = false;
    //     let cl2 = "text-tone-2 text-12 no-underline hover:underline px-xs py-xs flex ml-[3px] xs:ml-0 !bg-transparent !border-0 invisible h-0 !p-0";
    //     let arr = Array.from(document.getElementsByClassName(cl2))    
    //         while(arr){
    // console.log(arr.length)
    // try{
    // if(arr.length == 0){
    //     break;
    // }
    //     arr.pop().click()
    //     foundButton = true;
    //     console.log(`counter is: ${counter}`)
    // }catch(err){}
    
    
    // }
    // //     for (let each of arr) {
    // //         try {
    // //             if (each.innerText.includes("replies") || each.innerText.includes("reply")) {
    // //                 each.click();
    // //                 foundButton = true;  
    // //             }
    // //         } catch (err) {
    // //             console.error(err);
    // //         }
    // //     }
    //     // Enable this if you want recursive behavior
    // }
    
    // let counter = 0
    
    // while(counter < 20){
    //     if(counter < 20){
    //             clicker()
    //     }
    //     if(counter > 9){
    //     break;
    // }
    //         counter++
    
    // }

///////////////////////////////////////////////////

//Working
// function clicker() {
//     let foundButton = false;
//     let cl2 = "text-secondary-weak font-normal";
//     let arr = Array.from(document.getElementsByClassName(cl2))    
//     while(arr){
//     console.log(arr.length)
//     try{
//         if(arr.length == 0){
//             break;
//         }
//         let element = arr.pop()
//         if (element.innerText.includes("replies") || element.innerText.includes("reply")) {
//             element.click()
//         }


//         foundButton = true;
//         console.log(`counter is: ${counter}`)
//     }catch(err){}
// }//End of while
// }

// let counter = 0

// while(counter < 20){
//     if(counter < 20){
//             clicker()
//     }
//     if(counter > 9){
//     break;
// }
//         counter++

// }



// async function downloadJson(url) {
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();
//     await page.goto(jsonUrl, { waitUntil: 'networkidle0' });
//     const jsonData = await page.evaluate(() => {return JSON.parse(document.body.innerText);});


//     const outputJSON = JSON.stringify(jsonData);
//     fs.writeFileSync('output.json', outputJSON)
//     await browser.close();
//     return jsonData;
// }



// works well
// async function theclicker(page){
//     return await page.evaluate(()=> {
//         function clicker() {
//     let foundButton = false;
//     let cl2 = "text-secondary-weak font-normal";
//     let arr = Array.from(document.getElementsByClassName(cl2))    
//     while(arr){
//     console.log(arr.length)
//     try{
//         if(arr.length == 0){
//             break;
//         }
//         let element = arr.pop()
//         if (element.innerText.includes("replies") || element.innerText.includes("reply")) {
//             element.click()
//         }


//         foundButton = true;
//         console.log(`counter is: ${counter}`)
//     }catch(err){}
// }//End of while
// }

// let counter = 0

// while(counter < 20){
//     if(counter < 20){
//             clicker()
//     }
//     if(counter > 9){
//     break;
// }
//         counter++

// }

//     })//End of evalueate
// }





// async function theclicker(page){
//     return await page.evaluate(()=> {
//     function clicker() {
//     let cl2 = "text-secondary-weak font-normal";
//     let arr = Array.from(document.getElementsByClassName(cl2))    
//     while(arr){
//     try{
//         if(arr.length == 0){
//             break;
//         }
//         let element = arr.pop()
//         if (element.innerText.includes("replies") || element.innerText.includes("reply")) {
//             element.click()
//         }
//     }catch(err){}
// }//End of while
// }//End of the function

// clicker()

//     })//End of evalueate
// }


// async function eval_scroll_down(page) {
//     await page.evaluate(() => {
//         return new Promise((resolve, reject) => {
//             const interval = setInterval(() => {
//                 const maxScroll = document.body.scrollHeight - window.innerHeight;
//                 window.scrollBy(0, 100);
//                 if (window.scrollY >= maxScroll) {
//                     clearInterval(interval);
//                     resolve();  // Resolve the promise to indicate completion
//                 }
//             }, 300);
//         });
//     });
// }




    // const allLinksUnsorted = Array.from(new Set(JSON.parse(await fs.readFileSync(`all_links_unsorted.json`, 'utf8'))))
    // const checkAllLinksUnsorted = allLinksUnsorted.filter(cu => {
    //     if(cu && cu.length > 1 && cu.includes("/comments")){
    //         return cu
    //     }
    // })

    // console.log(checkAllLinksUnsorted.length)
    // const failUrls = Array.from(new Set(JSON.parse(await fs.readFileSync(`links_failed.json`, 'utf8'))))
    // let array = JSON.parse(await fs.readFileSync(`mod_links.json`, 'utf8'))
    // let thelinks = array.filter(cu => {
    //     if(cu && cu.length > 1 && cu.includes("/comments")){
    //         return cu
    //                 }
    // })

    //     const modlinks = Array.from(new Set(JSON.parse(await fs.readFileSync(`mod_links.json`, 'utf8').filter(cu => {
//         if(cu && cu.length > 1 && cu.includes("/comments")){
//             return cu
//         }
//     })









////////////////////////////////////


// let finished
// let allLinksUnsorted
// let failUrls
// let posts
// let allCommentLinks

// async function loadArrays(){
//     finished = new Set(JSON.parse(fs.readFileSync("finished.json", "utf-8")))
//     allLinksUnsorted = new Set(JSON.parse(fs.readFileSync(`all_links_unsorted.json`, 'utf8')))
//     failUrls = new Set(JSON.parse(fs.readFileSync(`links_failed.json`, 'utf8')))
//     posts = new Set(JSON.parse(fs.readFileSync(`posts.json`, 'utf8')))
//     allCommentLinks = new Set(JSON.parse( fs.readFileSync(`all_commenet_links.json`, 'utf8')))
// }















// async function iterClicker(page){
//     let loops = 20
//     let timeDelay = 3
//     let totalTime = loops * timeDelay
//     for(let i = 0; i < loops; i++){
//         let leftover = totalTime - (i * timeDelay)
//         console.log(`Loop: ${i} - Seconds left: ${leftover}`)
//         await theclicker(page)
//         await delay(timeDelay * 1000)
//     }
//     console.log("finished clicking")
// }




// // works well
// async function theclicker(page){

//     return await page.evaluate(() => {

//         function clicker() {
//             let cl2 = "text-secondary-weak font-normal";
//             let arr = Array.from(document.getElementsByTagName(cl2))    
//             while(arr){
//             try{
//                 if(arr.length == 0){
//                     break;
//                 }  
//                 let element = arr.pop()        
//                 if (element.innerText.includes("replies") || element.innerText.includes("reply")) {
//                     element.click()
//                 }
//             }catch(err){}
//         }//End of while
//         }//End of the function
        
//         clicker()

//     })
    
// }//End of evalueate



//////////////
// eval standard

// async function eval_links(page) {
//     return await page.evaluate(() => {
//     return Array.from(document.querySelectorAll("a")) // Changed to select only anchor tags
//     .map(element => element.href) // Map only elements with href
//     .filter(href => href && typeof href === 'string' && href.includes("/comment/")); 
// })}


// async function eval_getAllLinks_includesComment(page){
// return await page.evaluate(() => {
//     return Array.from(document.querySelectorAll("*")).map(element => element.href).filter(href => href && typeof href === 'string' && href.includes("/comment")); 
// })};


// async function eval_getAllLinks_includesPostComments(page){
// return await page.evaluate(() => {
//     return Array.from(document.querySelectorAll("*")).map(element => element.href).filter(href => href && typeof href === 'string' && href.includes("/comment/")); 
// })};




// async function failed(err, param, url){
//     let text = `\n${err}\n\n----------------------------------\n${param}\n----------------------------------\n\m`
//     console.log(text)
//     failUrls.add(url)
// }


// let arrayOfFileNames = [`all_links_unsorted`, "textFile", `links_failed`, `finished`, "posts", `all_commenet_links`]