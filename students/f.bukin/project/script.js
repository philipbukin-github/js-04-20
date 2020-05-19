const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';
const sendRequest = (url) => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    // console.log('200 !==', xhr.status);
                    reject(xhr.status);
                }
            }
        }

        xhr.timeout = 15000;

        xhr.ontimeout = () => {
            console.log('timeout');
        };

        xhr.open('GET', url, true);

        xhr.send();
    });
};

class GoodsItem {
    constructor(product_name, price, id_product) {
        this.product_name = product_name;
        this.price = price;
        this.id_product = id_product;
    }

    render() {
        return `<div class="goods-item"><h3>${this.product_name}</h3><p>${this.price}</p><button id="${this.id_product}" class="put_to_basket" onclick="basket.addToBasket(this)">Добавить в корзину</button></div>`;
    }
    renderBasket() {
        return `<div class="goods-item"><h3>${this.product_name}</h3><p>${this.price}</p><button id="${this.id_product}" class="delete_from_basket" onclick="basket.removeFromBasket(this)">Удалить из корзины</button></div>`;
    }
}

class GoodsList {
    constructor() {
        this.goods = [];
    }

    fetchGoods(callback) {
        sendRequest(`${API}/catalogData.json?page=1&sort=price`)
        .then(data => {
            this.goods = data;
            callback()
        }).catch(err => {
            console.log('Неудаётся получить данные:', err);
        })
    }

    render() {
        let goodsList = '';
        this.goods.forEach(({ product_name, price, id_product }) => {
            const goodItem = new GoodsItem(product_name, price, id_product);
            goodsList += goodItem.render();
        });
        document.querySelector('.goods-list').innerHTML = goodsList;
    }

    sumPrice(){
        let sumAllGoods = 0;
        this.goods.forEach(({price}) => {
            sumAllGoods += price;
        });
        return sumAllGoods;
    }
}
class Basket extends GoodsList{
    fetchGoods(callback) {
        sendRequest(`${API}/getBasket.json`)
        .then(data => {
            this.goods = data;
            callback()
        }).catch(err => {
            console.log('Неудаётся получить данные:', err);
        })
    }

    render() {
        let goodsList = '';
        this.goods.contents.forEach(({ product_name, price, id_product }) => {
            const goodItem = new GoodsItem(product_name, price, id_product);
            goodsList += goodItem.renderBasket();
        });
        document.querySelector('.cart-button').insertAdjacentHTML("beforeend",  ' (' + this.goods.countGoods + ')');
        document.querySelector('.basket-goods-list').innerHTML = goodsList;
        document.querySelector('.basket-goods-list').insertAdjacentHTML("beforeend",  `<div class="sum-goods"><h3>Итого: ${this.goods.amount}</h3></div>`)
    }
    addToBasket(obj) {
        sendRequest(`${API}/addToBasket.json?id_price=${obj.id}`)
        .then(function() {
        obj.setAttribute('class', 'delete_from_basket');
        obj.setAttribute('onclick', 'basket.removeFromBasket(this)');
        obj.innerHTML = 'Удалить из корзины';
        document.querySelector('.basket-goods-list').innerHTML = ''
        document.querySelector('.cart-button').innerHTML = '<i class="fa fa-shopping-cart" aria-hidden="true"></i> Корзина'

        })
        .then(function(){
        basket.fetchGoods(() => basket.render());
        })
        .catch(err => {
            console.log('Неудаётся получить данные:', err);
        })
        

    }
    removeFromBasket(obj){
        sendRequest(`${API}/deleteFromBasket.json?id_price=${obj.id}`)
        .then(function() {
        obj.setAttribute('class', 'put_to_basket');
        obj.setAttribute('onclick', 'basket.addToBasket(this)');
        obj.innerHTML = 'Добавить в корзину';
        document.querySelector('.basket-goods-list').innerHTML = ''
        document.querySelector('.cart-button').innerHTML = '<i class="fa fa-shopping-cart" aria-hidden="true"></i> Корзина'
        })
        .then(function(){
        basket.fetchGoods(() => basket.render());
        })
        .catch(err => {
            console.log('Неудаётся получить данные:', err);
        })


    }
}
function showBasket(obj){
    document.querySelector('.basket-goods-list').setAttribute('style', '')
    obj.setAttribute('onclick', 'hideBasket(this)');
}
function hideBasket(obj){
    document.querySelector('.basket-goods-list').setAttribute('style', 'display: none')
    obj.setAttribute('onclick', 'showBasket(this)');
}

const list = new GoodsList();
list.fetchGoods(() => list.render());
let basket = new Basket();
basket.fetchGoods(() => basket.render());


