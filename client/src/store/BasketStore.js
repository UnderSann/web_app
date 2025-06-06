import { makeAutoObservable } from 'mobx';

export default class BasketStore {
    constructor() {
        this._basketItems = [];
        this._page = 1;
        this._totalCount = 0;
        this._limit = 5;
        makeAutoObservable(this);
    }

    setBasketItems(basketItems) {
        this._basketItems = basketItems;
    }

    addBasketItem(basketItem) {
        this._basketItems.push(basketItem);
    }
    
    setPage(page) {
        this._page = page;
    }

    setTotalCount(totalCount) {
        this._totalCount = totalCount;
    }

    setLimit(limit) {
        this._limit = limit;
    }
    

    get basketItems() {
        return this._basketItems;
    }

 

    get page() {
        return this._page;
    }

    get totalCount() {
        return this._totalCount;
    }

    get limit() {
        return this._limit;
    }
}
