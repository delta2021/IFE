class Restaurant {
    constructor({money, seats, staff}){
        this.money = money;
        this.seats = seats;
        this.staff = staff;
    }

    hire(employee){
        this.staff.push(employee);
    }

    fire(index){
        this.staff.splice(index, 1);
    }
}

class Employee {
    constructor(ID, name, wage){
        this.ID = ID;
        this.name = name;
        this.wage = wage;
    }

    work(){
        console.log(this.name + 'worked');
    }
}

class Waiter extends Employee {
    work(para){
        if (Array.isArray(para)){
            console.log('took order: ' + para.join(', '));
        } else {
            console.log('served ' + para);
        }
    }
}


class Cook extends Employee {
    work(dish){
        console.log('cooked ' + dish);
    }
}

class Customer {
    constructor(table){
        this.table = table;
    }

    order(dishes){
        return dishes;
    }

    eat(){
        console.log('eat');
    }
}


class Dish{
    constructor(name, cost, price) {
        this.name = name;
        this.cost = cost;
        this.price = price;
    }
}


var ifeRestaurant = new Restaurant({
    cash: 1000000,
    seats: 20,
    staff: []
});

var newCook = new Cook(1, "Tony", 10000);
ifeRestaurant.hire(newCook);

console.log(ifeRestaurant.staff);

ifeRestaurant.fire(newCook);
console.log(ifeRestaurant.staff);