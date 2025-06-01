import { makeAutoObservable, action } from 'mobx';

export default class ItemStore {
    constructor() {
        this._types = [];
        this._items = [];
        this._imgs = [];
        this._selectedType = {};
        
        this._page = 1;
        this._totalCount = 0;
        this._limit = 5;
        this._onMain = 6;
        this._selectedColor = null;
        this._priceRange = { min: 0, max: 10000 };
        this._searchQuery = '';  // Новый параметр для хранения поискового запроса
        this._isSearchFilled = false;
        this._isFiltersFilled = false;
        makeAutoObservable(this, {
            // Указываем, что эти методы — это действия (actions)
            setSearchQuery: action,
            setTypes: action,
            setItems: action,
            setImgs: action,
            addItem: action,
            setSelectedType: action,
            setPage: action,
            setTotalCount: action,
            setLimit: action,
            setSelectedColor: action,
            setPriceRange: action,
            setIsSearchFilled: action,
            setFiltersFilled: action,
        });
    }

    // Методы для изменения состояния
    setSearchQuery(query) {
        this._searchQuery = query;
    }

    setTypes(types) {
        this._types = types;
    }

    setItems(items) {
        this._items = items;
    }

    setImgs(imgs) {
        this._imgs = imgs;
    }

    addItem(item) {
        this._items.push(item);
    }

    setSelectedType(type) {
        if (this._selectedType !== type) {
            this.setPage(1); 
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

    setSelectedColor(color) {
        this._selectedColor = color;
    }

    setPriceRange(range) {
        this._priceRange = range;
    }

    setIsSearchFilled(bool) {
        this._isSearchFilled = bool;
    }
    setIsFiltersFilled(bool) {
        this._isFiltersFilled = bool;
    }
    get isSearchFilled() {
        this.setPage(1); // Обновляем страницу, если флаг поиска изменился
        return this._isSearchFilled;
    }
    get isFiltersFilled() {
        this.setPage(1); // Обновляем страницу, если флаг поиска изменился
        return this._isFiltersFilled;
    }
    get selectedColor() {
        return this._selectedColor;
    }

    get priceRange() {
        return this._priceRange;
    }

    // Геттеры для состояния
    get types() {
        return this._types;
    }

    get items() {
        return this._items;
    }

    get imgs() {
        return this._imgs;
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

    get searchQuery() {
        return this._searchQuery;
    }
}
