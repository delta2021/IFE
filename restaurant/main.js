class Restaurant {
    constructor({cash, seats, staff}){
        this.cash = cash || 0;
        this.seats = seats || 0;
        this.staff = staff || [];
    }

    hire(employee){
        this.staff.push(employee);
    }

    fire(employee){
        if (!(employee instanceof Employee)) return false;
        for (const s of this.staff) {
            if (s.ID === employee.ID) {
                this.staff.splice(index, 1);
                return true;
            }
        }

        return false;
       
    }
}

class Employee {
    constructor(ID, name, wage){
        this.ID = ID;
        this.name = name;
        this.wage = wage;
    }

    work(){
        console.log(this.name + 'worked.');
    }
}

class Waiter extends Employee {
   takeOrder(customer, menu, cook){
        const dish = customer.order(menu);
        console.log(this.name + ' took down the order.');
        this.callCook(cook, dish);
       
    }
    callCook(cook, dish){
        console.log(this.name + ' pass the order to kitchen.');
        cook.cook(this, dish);
    }
   serve(dish){
       console.log(this.name + ' served ' + dish.name);
   }
   

}


class Cook extends Employee {
    cook(waiter, dish){
        console.log(this.name + ' ' +'cooked ' + dish.name);
        this.callWaiter(waiter, dish);
    }
    callWaiter(waiter, dish){
        console.log(this.name + ' told waiter to serve the dish.');
        waiter.serve(dish);
    }
}

class Customer {
    constructor(tableId){
        this.tableId = tableId;
        this.bill = [];
    }

    order(menu){
        const i =  Math.floor((Math.random() * menu.length));
        this.bill.push(menu[i]);
        console.log('customer at table ' + this.tableId + ' ordered ' + menu[i].name);
        return menu[i];
    }

    eat(){
        console.log('customer eats');
    }

    pay(){
        const money = this.bill.reduce((res, curr) => {
            res += curr.price;
            return res;
        }, 0);
        return money;
    }
}


class Dish{
    constructor(name, cost, price) {
        this.name = name;
        this.cost = cost;
        this.price = price;
    }
}


const ifeRestaurant = new Restaurant({
    cash: 1000000,
    seats: 1,
    staff: []
});

const newCook = new Cook(1, "Tony", 10000);
const newWaiter = new Waiter(2, 'Jay', 8000);

ifeRestaurant.hire(newCook);
ifeRestaurant.hire(newWaiter);


const menu = (function (){
    const food = ['chicken', 'pork', 'beef', 'broccoli', 'dessert', 'soup'];
    const cost = [30, 40, 50, 20, 20, 10];
    const menu = [];
    for (let i = 0, len = food.length; i < len; i++){
        const newDish = new Dish(food[i], cost[i], cost[i] * 1.3);
        menu.push(newDish);
    }
    return menu;
}())


const customers = [];
for (let i = 0; i < 5; i++){
    customers.push(new Customer(1));
}
customers.forEach(el => {
    newWaiter.takeOrder(el, menu, newCook);
    el.eat();
})

