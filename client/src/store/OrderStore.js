import { makeAutoObservable } from 'mobx';

export default class OrderStore {
    constructor() {
        this._orders = []; 
        this._userLimit = 30;
        this._limit = 30;
        makeAutoObservable(this);
    }

    setOrder(orders) {
        this._orders = orders; 
    }

    setUserLimit(userLimit) {
        this._userLimit = userLimit;
    }

    setLimit(limit) {
        this._limit = limit;
    }

    get orders() {
        return this._orders;
    }

    get userLimit() {
        return this._userLimit;
    }

    get limit() {
        return this._limit;
    }
}
