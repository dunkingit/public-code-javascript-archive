async function getImages(page){
    const ele = await page.$$eval('img', (elements)=>
elements.map((element) => ({
    src: element.src,
    alt: element.alt
})
))
return ele

};