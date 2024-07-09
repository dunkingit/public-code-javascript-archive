async function requester(page, request_urls) {
    page.on('request', interceptedRequest => {
        // Check if the request has already been handled
        if (interceptedRequest.interceptResolutionState().action === "already-handled") return;
        
        try {
            const url = interceptedRequest.url();
            request_urls.push(url); // Corrected to use the same variable name
        } catch(err) {}
        interceptedRequest.continue(); // Moved outside the try-catch to ensure it always executes
    });
  }