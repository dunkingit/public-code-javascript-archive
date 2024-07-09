// Screenshot all specified elements

async function screenElements(selector, page){
    await page.waitForSelector(selector, { visible: true });
    const elements = await page.$$(selector);
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        try {
            await element.screenshot({path: `element${i + 1}.png`})
        } catch (error) {
            console.error(`Error taking screenshot of element ${i + 1}:`, error);
        }
    }
}


module.exports = {
    screenElements,
  };


// ------------------------------------
// Screenshot all specified elements
    // const selector = 'a'; 
    // await page.waitForSelector(selector, { visible: true });
    // const elements = await page.$$(selector);
    // for (let i = 0; i < elements.length; i++) {
    //     const element = elements[i];
    //     try {
    //         await element.screenshot({path: `element${i + 1}.png`})
    //     } catch (error) {
    //         console.error(`Error taking screenshot of element ${i + 1}:`, error);
    //     }
    // }

// ------------------------------------