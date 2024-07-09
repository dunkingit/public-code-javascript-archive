async function getAllLinks(page) {
    const links = await page.evaluate(() => {
        const allTags = Array.from(document.querySelectorAll('*'));
        const hrefLinks = allTags.map(tag => tag.href).filter(href => href && href.length > 0);
        const otherLinks = Array.from(document.querySelectorAll('[onclick], [data-href], [data-link]'))
            .map(element => {
                const onclick = element.getAttribute('onclick');
                const dataHref = element.getAttribute('data-href');
                const dataLink = element.getAttribute('data-link');
                
                if (onclick) {
                    // Extract URLs from JavaScript onclick handlers (rudimentary)
                    const match = onclick.match(/(https|http?):\/\/[^\s'"]+/);
                    console.log(match)
                    if (match) return match[0];
                }
                if (dataHref) return dataHref;
                if (dataLink) return dataLink;
                return null;
            })
            .filter(link => link && link.length > 0);
        
        const allLinks = [...hrefLinks, ...otherLinks];
        const uniqueLinks = Array.from(new Set(allLinks));
        return uniqueLinks;
    });

    return links;
}

async function getElements(page, selector){
    const links = await page.$$eval(selector, (elements)=>
elements.map((element) => ({
    href: element.href,
    text: element.text
})
))  
    return links
};


// async function getAllLinks(page) {
//     const links = await page.evaluate(() => {
//         // Collect all anchor tags with an href attribute
//         const anchorTags = Array.from(document.querySelectorAll('a[href]'));
        
//         // Extract the href attribute and filter for non-empty, HTTP/HTTPS links
//         const httpLinks = anchorTags.map(anchor => anchor.href).filter(href => /^https?:\/\//i.test(href));
        
//         // Remove duplicates by converting to a Set and back to an Array
//         const uniqueLinks = Array.from(new Set(httpLinks));
        
//         return uniqueLinks;
//     });

//     return links;
// }


// async function getAllLinks(page) {
//     //http links
//     let links =  await page.evaluate(() => {

//     let allLinks = [
//         ...Array.from(document.querySelectorAll("*")).map(cu => cu.href).filter(cu => cu && cu.length > 0),
//         ...Array.from(document.getElementsByTagName("a")).map(cu => cu.href).filter(cu => cu && cu.length > 0)
//     ]
//     return allLinks
//     })

//     return links
// }