const time = 1000;
const ifeRestaurant = Restaurant.getInstance({
    cash: 1000000,
    seats: 1,
    staff: []
});
const chef = Chef.getInstance(1, 'Bob', 12000);
const waiter = Waiter.getInstance(2, 'Luke', 9500);
ifeRestaurant.hire(chef);
ifeRestaurant.hire(waiter);

chef.subscribe(myBind(waiter, 'work'));
const menu = (function (){
    const food = ['chicken', 'pork', 'beef', 'broccoli', 'dessert', 'soup'];
    const cost = [30, 40, 50, 20, 20, 10];
    const menu = [];
    for (let i = 0, len = food.length; i < len; i++){
        const newDish = new Dishes(food[i], cost[i], cost[i] * 1.3, Math.floor(Math.random()*10));
        menu.push(newDish);
    }
    return menu;
}())

// workFlow();

const customerQueue = (function(){
    const queue = [];
    let intervalID; 
    function start(){
        console.log('顾客开始到来...')
        const i = getRandomInt(0, personNames.length - 1);
        const name = personNames[i];
        queue.push(new Customer(name));
        console.log('新的顾客来了...')
        intervalID = setInterval(() => {
            const i = getRandomInt(0, personNames.length - 1);
            const name = personNames[i];
            queue.push(new Customer(name));
            console.log('新的顾客来了...')
        }, 20000);
    }
    return {queueList: queue,
        dequeue: function(){
            if (queue.length > 0){
                const len = queue.length - 1;
                return resolvedPromise(0, queue.shift());
            } else {
                //如果暂时没有顾客， 就等两分钟
                console.log('waiting new customer to arrive...');
                return resolvedPromise(20000, function(){
                    return queue.shift();
                });
            }
            
        },
        stop: function(){
            clearInterval(intervalID);
            console.log('停止接待顾客， 准备结束营业');
        },
        start: start
    };
}())

customerQueue.start();

customerQueue.dequeue().then((cust) => {
    console.log('接待顾客： ' + cust.name)
    cust.sit();
    return resolvedPromise(0, cust);
}).then((cust) => {
    console.log('顾客正在查看菜单...');
    return resolvedPromise(3000, myBind(cust, 'order'), menu);
}).then((order) => {
    //如果waiter不在顾客旁边， 要先花0.5s走到顾客那里才能记录菜单
    if (!document.getElementById('waiter-img').classList.contains('right')){
        waiterMoveRight();
        return resolvedPromise(500,myBind(waiter, 'work'), order);
    }
    return resolvedPromise(0, myBind(waiter, 'work'), order);
}).then((cookList) => {
    if (!document.getElementById('waiter-img').classList.contains('left')){
        waiterMoveLeft();
        return resolvedPromise(500, myBind(chef, 'work'), cookList);
    }
    return resolvedPromise(0, myBind(chef, 'work'), order);
})





function workFlow(){
    let cust;
    new Promise((res, rej) => {
        setTimeout(() => {
            res();
        }, 3000)
    })
    .then(() => {
        cust = new Customer()
        cust.sit();
        return new Promise((res, rej) => {
            setTimeout(() => {
                cust.order(menu);
                res(cust.ordered);
            }, 3000)
            
        })
    })
    .then((list) => {
        return new Promise((res, rej) => {
            setTimeout(() => {
                waiter.work(list);
                res(list);
            }, 3000)
           
        })
    })
    .then((list) => {
        let p = Promise.resolve();
        for (let i = 0, len = list.length; i < len; i++){
            const food = list[i];
            p = p.then(() => {
                chef.work(food);
                return new Promise((res, rej) => {
                    setTimeout(() => {
                        res()
                    }, 3000)
                })
            })
            .then(() => {
                waiter.work(food);
                return new Promise((res, rej) => {
                    setTimeout(() => {
                        res()
                    }, 3000)
                })
            })
            .then(() => {
                cust.eat(food);
                setTimeout(() => {
                    if (i === len - 1){
                        cust.pay();
                    }
                }, 3000)
               
            })
        }
          
          
        
    })

}



const chefTimer = (function(){
    const dom = document.getElementById('chef-time');
    return function(time){
        timer(dom, time);
    }
}())

const customerTimer = (function(){
    const dom = document.getElementById('customer-time');
    return function(time){
        timer(dom, time);
    }
}())

chefTimer(3000);
customerTimer(3000);




const waiterMoveLeft = (function(){
    const dom = document.getElementById('waiter-img');
    return function(){
        removeClass(dom, 'right');
    }
    
}())

const waiterMoveRight = (function(){
    const dom = document.getElementById('waiter-img');
    return function(){
        addClass(dom, 'right');
    }
}())





function waiterMoveRound(){
    Promise.resolve().then(() => {
        waiterMoveRight();
        return resolvedPromise(500);
    }).then(() => {
        waiterMoveLeft();
    })
}



