
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


async function scroller(){
    await new Promise((resolve, reject) => {
      const interval = setInterval(() => {
          const maxScroll = document.body.scrollHeight - window.innerHeight;
          window.scrollBy(0, 100);
          if (window.scrollY >= maxScroll) {
              clearInterval(interval);
              resolve();  // Resolve the promise to indicate completion
          }
  
      }, 1500);
    })
  
  }
  scroller()
