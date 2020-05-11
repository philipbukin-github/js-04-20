class GoodsItem {
    constructor(title, price) {
        this.title = title;
        this.price = price;
    }

    render() {
        return `<div class="goods-item"><h3>${this.title}</h3><p>${this.price}</p></div>`;
    }
}

class GoodsList {
    constructor() {
        this.goods = [];
    }

    fetchGoods() {
        this.goods = [
            { title: 'Shirt', price: 100 },
            { title: 'Socks', price: 50 },
            { title: 'Jacket', price: 200 },
            { title: 'Shoes', price: 300 },
        ];
    }

    render() {
        let goodsList = '';
        this.goods.forEach(({ title, price }) => {
            const goodItem = new GoodsItem(title, price);
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
    countGoods () {
        let countGoods = 0;
        this.goods.forEach(() => {
            countGoods++;
        });
        document.querySelector('.cart-button').insertAdjacentHTML("beforeend",  ' (' + countGoods + ')');
    }
    render() {
        let goodsList = '';
        this.goods.forEach(({ title, price }) => {
            const goodItem = new GoodsItem(title, price);
            goodsList += goodItem.render();
        });
        document.querySelector('.basket-goods-list').innerHTML = goodsList;
        document.querySelector('.basket-goods-list').insertAdjacentHTML("beforeend",  `<div class="sum-goods"><h3>Итого: ${this.sumPrice()}</h3></div>`)
    }
}

const list = new GoodsList();
list.fetchGoods();
list.render();
let basket = new Basket();
basket.fetchGoods();
basket.countGoods();