import { makeAutoObservable } from 'mobx';

export default class ItemStore {
    constructor() {
        this._userId = {};
        this._basketItems = [];
        this._page = 1;
        this._totalCount = 0;
        this._limit = 5;
        makeAutoObservable(this);
    }

    setTypes(types) {
        this._types = types;
    }

    setItems(items) {
        this._items = items;
    }

    addItem(item) {
        this._items.push(item);
    }

    setSelectedType(type) {
        if (this._selectedType !== type) {
            this.setPage(1);  // Переключаемся на первую страницу
            this._selectedType = type;
        }
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

    get types() {
        return this._types;
    }

    get items() {
        return this._items;
    }

    get selectedType() {
        return this._selectedType;
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
    get onMain() {
        return this._onMain;
    }
}
