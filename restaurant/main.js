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
    chefList.updateStatus(food.name, '做好了');
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
            startEating(food);
          
            return resolvedPromise(3000, food);
        }).then((food) => {
           
            finishEating(food);
         
        })
        //服务员在厨师处。
    } else{
          //移动到顾客那里， 上菜。   
        p.then((food) => {
            waiterMoveRight();
            myBind(waiter, 'work')(food);
            startEating(food);
            return resolvedPromise(3000, food);
        }).then((food) => {
           finishEating(food);
        })
         
    } 
  
   

}, 'finish');

chef.subscribe((food) => {
    chefList.updateStatus(food.name, '正在做');
    chefTimer(food.time);
    ChefStatus.setStatus(false);
}, 'start');


chef.subscribe(() => {
    ChefStatus.setStatus(true);
}, 'done');

const menu = (function (){
    const food = ['葱香鸡肉卷', '农家小炒肉', '水煮牛肉', '蒜蓉西兰花', '椰汁龟苓膏', '莲藕排骨汤', '菠萝咕噜肉',
    '上汤娃娃菜', '盐水菜心', '蒜香骨', '椒盐濑尿虾', '香芋扣肉', '玫瑰豉油鸡'
];
    const cost = [30, 40, 50, 20, 20, 10, 40, 25, 80, 60, 78, 88, 88];
    const menu = [];
    for (let i = 0, len = food.length; i < len; i++){
        const newDish = new Dishes(food[i], cost[i], Math.floor(cost[i] * 1.3), getRandomSeconds(1, 5));
        menu.push(newDish);
    }
    return menu;
}())


const customerQueue = (function(){
    const queue = [];
    let intervalID = undefined; 
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
            //顾客超过10个，暂停发号
            if (queue.length >= 10) {
                clearInterval(intervalID);
                intervalID = undefined;
            }
        }, 10000);
    }
    return {queueList: queue,
        dequeue: function(){
            if (intervalID == undefined) {
                start();
            }
            if (queue.length > 0){
                const len = queue.length - 1;
                const cust = queue.shift();
                updateWaitingList(queue);
                return resolvedPromise(0, cust);
            } else {
                //如果暂时没有顾客， 就等20s
                console.log('waiting new customer to arrive...');
                customerTimer(10000);
                return resolvedPromise(10000, function(){
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
workFlow();



 function workFlow(){
    customerStatus.setStatus(0);
    customerTimer(1000);
    resolvedPromise(1000, () => {
        let customer = customerQueue.dequeue();
        return customer;
     })
     .then((cust) => {
         console.log('接待顾客： ' + cust.name);
         customerStatus.setImg(true);
         customerStatus.setStatus(1);
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
                 chefList.newList(cookList);    
                 return cookList;
             }, cookList).then(myBind(chef, 'work'));
         } else {
             chefList.newList(cookList);
             return resolvedPromise(0, myBind(chef, 'work'), cookList);
         }
     })

}
function startEating(food){
    food.customer.eat(food);
    customerStatus.setStatus(2);
    customerList.updateStatus(food.name, '正在吃。。');

}
function finishEating(food){
    customerList.updateStatus(food.name, '吃完了。。');
    console.log('吃完了。');
    if (food.isLast) {
        food.customer.pay();
    }
}







