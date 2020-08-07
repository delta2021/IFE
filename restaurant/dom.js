function getById(id){
    return document.getElementById(id);
}


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


const waiterAtRight = (function(){
    const dom = document.getElementById('waiter-img');
    return function(){
        //true- 在右边， 顾客那里， false- 在左边，厨师那里。
        console.log(dom.classList.contains('right'));
        return dom.classList.contains('right');
    }
}())


const updateWaitingList = (function(){
    const nameList = getById('waiting-list');
    const number = getById('waiting-number');

    return function(names){
        number.textContent = names.length;
        nameList.innerHTML = '';
        names.forEach(el => {
            const li = document.createElement('li');
            li.textContent = el.name;
            nameList.appendChild(li);
        })
    }
}())


const customerList = (function(){
    const dom = getById('customer-list');
    return {
        newList: function(order){
            dom.innerHTML = '';
            order.forEach(el => {
                const li = document.createElement('li');
                li.setAttribute('id', el.name);
                li.innerHTML = `${el.name}(<span>还未上</span>)`;
                dom.appendChild(li);
            });
        },
        updateStatus: function(name, status){
            const span = dom.querySelector('#' + name).querySelector('span');
            span.textContent = status;
        }
    }
}())


const chefList = (function(){
    const dom = getById('chef-list');
    const obj = {
        newList: function(order){
            dom.innerHTML = '';
            order.forEach(el => {
                const li = document.createElement('li');
                li.setAttribute('id', el.name);
                li.setAttribute('class', el.name);
                li.innerHTML = `${el.name}(<span>还没做</span>)`;
                dom.appendChild(li);
            });
        },
        updateStatus: function(name, status){
            const id = `#${name}`
  
            const span = dom.querySelector(id).querySelector('span');
            span.textContent = status;
        
        }
    };

    return obj;

}())


const updateCash = (function(){
    const dom = getById('cash');
    return function(){
        dom.textContent = Restaurant.getInstance({}).cash;
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
