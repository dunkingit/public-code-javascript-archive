async function responser(page, response_urls){
    page.on('response', async response => {
        try{
            const url = response.url();
            response_urls.push(url)
        }catch(err){
            
        }


        // try{
        //     responseArray.push(await response.text())
        // }catch(err){}

    //     try {
    //       const jsonResponse = await response.json();
    //       if (Array.isArray(jsonResponse)) {
    //         jsons.push(...jsonResponse)
    //       }else{
    //         jsons.push(jsonResponse)
    //       }
    //   }catch(err){}
  }) //end page on
  };//end