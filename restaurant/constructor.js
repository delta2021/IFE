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


Restaurant.prototype.fire = function(key, value){
    for (let i = 0, len = this.staff.length; i < len; i++){
        if (this.staff[i][key] === value){
            this.staff.splice(i, 1);
            return true;
        }     
    }
    return false;//没找到对应的员工
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
        .join(', '));//把order放在dom上
        return item;
    } else {
        console.log(this.name + ' served ' + item.name);
    }
}

Waiter.getInstance = function(id, name, wage){
    if (!this.instance){
        this.instance = new Waiter(id, name, wage);
    }
    return this.instance;
}

function Chef(id, name, wage){
    Employee.call(this, id, name, wage);
    this.observer = [];
}

Chef.prototype = Object.create(Employee.prototype);
Chef.prototype.constructor = Chef;
Chef.prototype.work = function(dishes){
    // dishes.forEach(el => {
    //     console.log(this)
    //     console.log(this.name + ' is cooking ' + el.name);  
    //     this.observer.forEach(fn => {
    //         fn(el);
    //     })
        
    // })
    let n = dishes.length;
    while (n-- > 0){
        //promise
    }
   
}
Chef.prototype.subscribe = function(fn){
    this.observer.push(fn);
}
Chef.prototype.unsubscribe = function(fn){
    const i = this.observer.indexOf(fn);
    this.observer.splice(i, 1);
}
Chef.getInstance = function(id, name, wage){
    if (!this.instance){
        this.instance = new Chef(id, name, wage);
    }
    return this.instance;
}

function Customer(name){
    this.name = name
};

Customer.prototype.sit = function(){
    console.log('customer sits down.');
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
   
    console.log('customer' + ' decides to order ' + names.join(', '));
    return ordered;
}

Customer.prototype.pay = function(){
    const price = this.ordered.reduce((res, curr) => {
        return res += curr.price;
    }, 0);
    console.log('customer paid ' + price + ' CNY');
    Restaurant.getInstance({}).cash += price;
    workFlow()
 
}

Customer.prototype.eat = function(dishes){
    console.log('customer' + ' is eating '+ dishes.name);
    
}



function Dishes(name, cost, price, time){
    this.name = name;
    this.cost = cost;
    this.price = price;
    this.time = time
}
