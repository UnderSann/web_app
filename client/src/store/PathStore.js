import { makeAutoObservable } from "mobx";
import { SHOP_ROUTE } from '../utils/consts';

export default class PathStore {
    _pathStack = []; // Изначально стек пустой

    constructor() {
        makeAutoObservable(this); // MobX отслеживает изменения
    }

    // Добавить маршрут в стек (push)
    push(route) {
        this._pathStack.push(route); // Новый маршрут добавляется в конец
    }

    // Удалить последний маршрут из стека (pop)
    pop() {
        if (this._pathStack.length > 0) {
            return this._pathStack.pop(); // Исправлено: Удалить и вернуть последний маршрут
        }
        return SHOP_ROUTE; // Если стек пустой, вернуть SHOP_ROUTE
    }

    // Получить текущий стек
    getStack() {
        return this._pathStack; // Возвращаем текущий стек
    }

    // Очистить стек
    clear() {
        this._pathStack = []; // Очищаем стек
    }
}
