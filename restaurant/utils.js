function addClass(domElement, className){
    domElement.classList.add(className);
}

function removeClass(domElement, className){
    domElement.classList.remove(className);
}

function timer(domElement, time){
    let intervalID = setInterval(() => {
        time -= 200;
        domElement.textContent = (time / 1000).toFixed(2);
        if (time <= 0) clearInterval(intervalID);
    }, 200)
}

function resolvedPromise(delay, para){
    return new Promise((res, rej) => {
        setTimeout(() => {
            let val = para;
            //支持运行函数来获得传给res的参数
            if (isFunction(para)){
                let paraForFn = Array.prototype.slice.call(arguments, 2);
                val = para(...paraForFn);
            }
            res(val);
        }, delay);
    })
}

function getRandomInt(min, max){
    return min + Math.floor(Math.random()*(max - min + 1)); 
}


function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
   }


function block(milliseconds){
    const now = new Date().getTime();
    while (new Date().getTime() - now < milliseconds){
        //do nothing, waiting until milliseconds after
    }
    console.log(milliseconds + ' s has passed..')
}

function myBind(obj, method){
    return obj[method].bind(obj);
}