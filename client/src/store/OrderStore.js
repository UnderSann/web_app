import { makeAutoObservable } from 'mobx';

export default class OrderStore {
    constructor() {
        this._orders = []; 
        this._page = 1;
        this._limit = 5;
        this._totalCount = 0;
        makeAutoObservable(this);
    }
    setTotalCount(totalCount) {
        this._totalCount = totalCount;
    }


    setPage(page) {
        this._page = page;
    }

    setLimit(limit) {
        this._limit = limit;
    }
    setOrder(orders) {
        this._orders = orders; 
    }
    get orders() {
        return this._orders;
    }

    get page() {
        return this._page;
    }

    get limit() {
        return this._limit;
    }
    
    get totalCount() {
        return this._totalCount;
    }
}
