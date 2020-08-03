function Restaurant({cash, seats, staff}){
    this.cash = cash || 0;
    this.seats = seats || 0;
    this.staff = staff || [];
}

Restaurant.prototype.hire = function(employee){
    if (this.staff.indexOf(employee) === -1) {
        this.staff.push(employee);
        console.log('The restaurant hired ' + employee.name + '.');
        console.log(employee);
        return true;
    }
    return false;
}

Restaurant.prototype.fire = function(key){
    let index;
    if (typeof key === 'object' && key !== null){
        index = this.staff.indexOf(key);
    } else {
        for (let i = 0, len = this.staff.length; i < len; i++){
            if (this.staff[i].id === key){
                index = i;
            }
        }
    }
    if (index >= 0){
        const name = this.staff[index].name;
        this.staff.splice(index, 1);
        console.log('The restaurant fired ' + name + '.')
        return true;
    } else {
        return false;
    }
}


Restaurant.getInstance = function({cash, seats, staff}){
    if (!this.instance) {
        this.instance = new Restaurant({cash, seats, staff});
    }

    return this.instance;
}


function Employee(id, name, wage){
    this.id = id;
    this.name = name;
    this.wage = wage;
  
}

Employee.prototype.work = function(){
    console.log(this.name + ' has worked once!');
}

function Waiter(id, name, wage){
    Employee.call(this, id, name, wage);
}

Waiter.prototype = Object.create(Employee.prototype);
Waiter.prototype.constructor = Waiter;
Waiter.prototype.work = function(item){
    if (Array.isArray(item)) {
        console.log(this.name + ' took order: ' + item.map(el => el.name)
        .join(', '));
        item.forEach(el => {
            this.callChef(el);
        })
        
    } else {
        console.log(this.name + ' served ' + item.name);
        Customer.getInstance().eat(item);
    }
}

Waiter.prototype.callChef = function(dishes){
    const chef = Chef.getInstance();
    console.log(this.name + ' told chef to cook ' + dishes.name)
    chef.work(dishes);
   
}
Waiter.getInstance = function(id, name, wage){
    if (!this.instance){
        this.instance = new Waiter(id, name, wage);
    }
    return this.instance;
}

function Chef(id, name, wage){
    Employee.call(this, id, name, wage);
}

Chef.prototype = Object.create(Employee.prototype);
Chef.prototype.constructor = Chef;
Chef.prototype.work = function(dishes){
    console.log(this.name + ' is cooking ' + dishes.name);
    new Promise((res, rej) => {
        setTimeout(() => {
           res(dishes)
        }, 3000)
    }).then(this.callWaiter);
}

Chef.prototype.callWaiter = function(dishes){
    const waiter = Waiter.getInstance();
    console.log(this.name + ' told waiter to serve ' + dishes.name )
    waiter.work(dishes);
}
Chef.getInstance = function(id, name, wage){
    if (!this.instance){
        this.instance = new Chef(id, name, wage);
    }
    return this.instance;
}

function Customer(name){
    this.name = name;
}

Customer.prototype.sit = function(resolve, reject){
    console.log('customer sits down.');
  
    setTimeout(() => {
        resolve(menu);
        
    }, 3000)
}

Customer.prototype.callWaiter = function(menu){
   const waiter =  Waiter.getInstance();
   console.log(this.name + ' called waiter');
   const foods = this.order(menu)
   waiter.work(foods);
}

Customer.prototype.order = function(menu){
    const ordered = [];
    let n = Math.floor(Math.random()*6);
    while (n == 0){
        n = Math.floor(Math.random()*6);
    }
    this.remaining = n;

    while (n >= 1){
        const i =  Math.floor((Math.random() * menu.length));
        ordered.push(menu[i]);
        n--;
    }

    this.ordered = ordered;
  
    const names = ordered.map(el => {
        return el.name;
    })
   
    console.log(this.name + ' decides to order ' + names.join(', '));
    return ordered;
}

Customer.prototype.pay = function(){
    const price = this.ordered.reduce((res, curr) => {
        return res += curr.price;
    }, 0);
    console.log('customer paid ' + price + ' CNY');
    Restaurant.getInstance({}).cash += price;
 
}

Customer.prototype.eat = function(dishes){
    console.log(this.name + ' is eating '+ dishes.name);
    this.remaining--;
    if (this.remaining === 0){
        new Promise((res, rej) => {
            setTimeout(() => {
                res();
            }, 3000)
        }).then(() => {
            this.pay.call(this);
            Customer.instance = null;
            console.log(this.name + ' left.');
        })
       
    }
    
}

Customer.getInstance = function(name){
    if (!this.instance) {
        this.instance = new Customer(name);
    }
    return this.instance;
}

function Dishes(name, cost, price, time){
    this.name = name;
    this.cost = cost;
    this.price = price;
    this.time = time
}


const time = 1000;
const ifeRestaurant = Restaurant.getInstance({
    cash: 1000000,
    seats: 1,
    staff: []
});
const chef = Chef.getInstance(1, 'Bob', 12000);
const waiter = Waiter.getInstance(2, 'Luke', 9500);

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




ifeRestaurant.hire(chef);
ifeRestaurant.hire(waiter);

const people = ['Lizzy', 'Erika', 'Chris', 'John', 'Pete'];

let person  = people[1];
const cust = Customer.getInstance(person);
new Promise(cust.sit.bind(cust)).then(cust.callWaiter.bind(cust));


