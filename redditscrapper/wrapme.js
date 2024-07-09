let myEventLogger = {}



async function eventLogger(event, myEventLogger){
    let num = Object.keys(myEventLogger).length + 1;
    myEventLogger[num] = event
}


async function wrap(object, method, wrapper, eventLogger) {
    const originalMethod = object[method];

    object[method] = async function(...args) {
        try {
            await eventLogger(`Calling ${method}`, eventLogger);  // Log before calling

            // Execute wrapper with original method and arguments
            const result = await wrapper.apply(this, [originalMethod.bind(this), ...args]);
            
            await eventLogger(`Successfully returned from ${method}`, eventLogger);  // Log after successful return
            return result;
        } catch (ex) {
            await eventLogger(`Error in ${method}: ${ex}`, eventLogger);  // Log errors
            throw ex;
        }
    };
}


function loggingWrapper(originalFunction, ...args) {
    console.log(`Calling function with args: ${args.join(', ')}`);
    const result = originalFunction(...args);
    console.log(`Function returned with result: ${result}`);
    return result;
}



function autoWrapAll(obj, wrapper) {
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'function') {
            obj[key] = wrap(obj[key], wrapper);
        }
    });
}


const mathOperations = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b
};

autoWrapAll(mathOperations, loggingWrapper);


