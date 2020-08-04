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

workFlow();

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


