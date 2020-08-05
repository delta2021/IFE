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

chef.subscribe((food) => {
    let p = Promise.resolve(food);
    //服务员在顾客处。
    if (waiterAtRight()){
        waiterMoveLeft();
        p.then((food) => {
           
            //等1s,让服务员移动到厨师那里。
            return resolvedPromise(2000, food);
        }).then((food) => {
            waiterMoveRight();
            myBind(waiter, 'work')(food);
            food.customer.eat(food);
            customerList.updateStatus(food.name, '正在吃。。');
          
            return resolvedPromise(3000, food);
        }).then((food) => {
            customerList.updateStatus(food.name, '吃完了。。')
            console.log('吃完了。');
        })
        //服务员在厨师处。
    } else{
          //移动到顾客那里， 上菜。
          
        p.then((food) => {
            waiterMoveRight();
            myBind(waiter, 'work')(food);
            food.customer.eat(food);
            customerList.updateStatus(food.name, '正在吃。。');
            return resolvedPromise(3000, food);
        }).then((food) => {
            customerList.updateStatus(food.name, '吃完了。。')
            console.log('吃完了。');
        })
         
    } 
  
   

});

chef.subscribe((food) => {
    chefTimer(food.time);
})
const menu = (function (){
    const food = ['chicken', 'pork', 'beef', 'broccoli', 'dessert', 'soup'];
    const cost = [30, 40, 50, 20, 20, 10];
    const menu = [];
    for (let i = 0, len = food.length; i < len; i++){
        const newDish = new Dishes(food[i], cost[i], cost[i] * 1.3, getRandomInt(1000, 4000));
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
        console.log('新的顾客来了...');
        updateWaitingList(queue);
        intervalID = setInterval(() => {
            const i = getRandomInt(0, personNames.length - 1);
            const name = personNames[i];
            queue.push(new Customer(name));
            console.log('新的顾客来了...');
            updateWaitingList(queue);
        }, 20000);
    }
    return {queueList: queue,
        dequeue: function(){
            if (queue.length > 0){
                const len = queue.length - 1;
                const cust = queue.shift();
                updateWaitingList(queue);
                return resolvedPromise(0, cust);
            } else {
                //如果暂时没有顾客， 就等两分钟
                console.log('waiting new customer to arrive...');
                return resolvedPromise(20000, function(){
                    const cust = queue.shift();
                    updateWaitingList(queue);
                    return cust;
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
    customerTimer(3000);
    return resolvedPromise(3000, (menu) => {
        const order = myBind(cust, 'order')(menu);
        customerList.newList(order);
        return order; 
    }, menu);
}).then((order) => {
    //如果waiter不在顾客旁边， 要先花0.5s走到顾客那里才能记录菜单;
    if (!waiterAtRight()){
        waiterMoveRight();
        return resolvedPromise(500,myBind(waiter, 'work'), order);
    }
    return resolvedPromise(0, myBind(waiter, 'work'), order);
}).then((cookList) => {
    if (!document.getElementById('waiter-img').classList.contains('left')){
        waiterMoveLeft();
        return resolvedPromise(500, (cookList) => {
            myBind(chef, 'work')(cookList);
            return cookList;
        }, cookList).then(chefList.newList);
    }

    chefList.newList(cookList)
    return resolvedPromise(0, myBind(chef, 'work'), cookList);
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









