import { makeAutoObservable } from 'mobx'

export default class ItemStore{
    constructor(){
        this._types = [
            /*
            {id: 1, name: 'Мешочек',typeId:1},
            {id: 2, name: 'Шопер',typeId:2},
            {id: 3, name: 'Сумочка',typeId:3},
            {id: 4, name: 'Влад',typeId:4},
            */
        ]
        this._items=[
            {
                "id": 9,
                "name": "Шопер висючка v2",
                "price": 50,
                "rating": 0,
                "img": "d70a367b-0cdf-4896-8f5c-f2b237647950.png",
                "createdAt": "2025-02-25T18:15:36.208Z",
                "updatedAt": "2025-02-25T18:15:36.208Z",
                "typeId": 2
            },
            {
                "id": 1,
                "name": "Шопер",
                "price": 120,
                "rating": 0,
                "img": "935505b7-17de-4794-9abc-b1d2156c7df9.png",
                "createdAt": "2025-02-24T20:35:58.510Z",
                "updatedAt": "2025-02-24T20:35:58.510Z",
                "typeId": 2
            },
            {
                "id": 3,
                "name": "Мешочек",
                "price": 5,
                "rating": 0,
                "img": "6bb77954-334d-4e05-85c8-c1d39c41a4c2.png",
                "createdAt": "2025-02-24T20:36:59.262Z",
                "updatedAt": "2025-02-24T20:36:59.262Z",
                "typeId": 1
            },
            {
                "id": 8,
                "name": "Шопер висючка",
                "price": 50,
                "rating": 0,
                "img": "bcca1ad5-09f9-496b-9577-81b5a18ff378.png",
                "createdAt": "2025-02-25T18:14:43.127Z",
                "updatedAt": "2025-02-25T18:14:43.127Z",
                "typeId": 2
            }
            /*
            {
                "id": 1,
                "name": "Шопер висючка v2",
                "price": 50,
                "rating": 0,
                "img": "d70a367b-0cdf-4896-8f5c-f2b237647950.png",
                "createdAt": "2025-02-25T18:15:36.208Z",
                "updatedAt": "2025-02-25T18:15:36.208Z",
                typeId:2
            },
            {
                "id": 2,
                "name": "Шопер с невыносимо длинным названием настолько длинным что на карточке нет места",
                "price": 120,
                "rating": 0,
                "img": "935505b7-17de-4794-9abc-b1d2156c7df9.png",
                typeId:2
            },
            {
                "id": 3,
                "name": "Мешочек",
                "price": 5,
                "rating": 0,
                "img": "6bb77954-334d-4e05-85c8-c1d39c41a4c2.png",
                typeId:1
            },
            {
                "id": 4,
                "name": "Шопер висючка",
                "price": 50,
                "rating": 0,
                "img": "bcca1ad5-09f9-496b-9577-81b5a18ff378.png",
                typeId:2
            },
            {
                "id": 1,
                "name": "Шопер висючка v2",
                "price": 50,
                "rating": 0,
                "img": "d70a367b-0cdf-4896-8f5c-f2b237647950.png",
                "createdAt": "2025-02-25T18:15:36.208Z",
                "updatedAt": "2025-02-25T18:15:36.208Z",
                typeId:2
            },
            {
                "id": 2,
                "name": "Шопер",
                "price": 120,
                "rating": 0,
                "img": "935505b7-17de-4794-9abc-b1d2156c7df9.png",
                typeId:2
            },
            {
                "id": 3,
                "name": "Мешочек",
                "price": 5,
                "rating": 0,
                "img": "6bb77954-334d-4e05-85c8-c1d39c41a4c2.png",
                typeId:1
            },
            {
                "id": 4,
                "name": "Шопер висючка",
                "price": 50,
                "rating": 0,
                "img": "bcca1ad5-09f9-496b-9577-81b5a18ff378.png",
                typeId:2
            },
            {
                "id": 1,
                "name": "Шопер висючка v2",
                "price": 50,
                "rating": 0,
                "img": "d70a367b-0cdf-4896-8f5c-f2b237647950.png",
                "createdAt": "2025-02-25T18:15:36.208Z",
                "updatedAt": "2025-02-25T18:15:36.208Z",
                typeId:2
            },
            {
                "id": 2,
                "name": "Шопер",
                "price": 120,
                "rating": 0,
                "img": "935505b7-17de-4794-9abc-b1d2156c7df9.png",
                typeId:2
            },
            {
                "id": 3,
                "name": "Мешочек",
                "price": 5,
                "rating": 0,
                "img": "6bb77954-334d-4e05-85c8-c1d39c41a4c2.png",
                typeId:1
            },
            {
                "id": 4,
                "name": "Шопер висючка",
                "price": 50,
                "rating": 0,
                "img": "bcca1ad5-09f9-496b-9577-81b5a18ff378.png",
                typeId:2
            },
            {
                "id": 1,
                "name": "Шопер висючка v2",
                "price": 50,
                "rating": 0,
                "img": "d70a367b-0cdf-4896-8f5c-f2b237647950.png",
                "createdAt": "2025-02-25T18:15:36.208Z",
                "updatedAt": "2025-02-25T18:15:36.208Z",
                typeId:2
            },
            {
                "id": 2,
                "name": "Шопер",
                "price": 120,
                "rating": 0,
                "img": "935505b7-17de-4794-9abc-b1d2156c7df9.png",
                typeId:2
            },
            {
                "id": 3,
                "name": "Мешочек",
                "price": 5,
                "rating": 0,
                "img": "6bb77954-334d-4e05-85c8-c1d39c41a4c2.png",
                typeId:1
            },
            {
                "id": 4,
                "name": "Шопер висючка",
                "price": 50,
                "rating": 0,
                "img": "bcca1ad5-09f9-496b-9577-81b5a18ff378.png",
                typeId:2
            },




            {
                "id": 1,
                "name": "110 кг гавна",
                "price": 50,
                "rating": 0,
                "img": "d70a367b-0cdf-4896-8f5c-f2b237647950.png",
                "createdAt": "2025-02-25T18:15:36.208Z",
                "updatedAt": "2025-02-25T18:15:36.208Z",
                typeId:4
            },
            {
                "id": 2,
                "name": "110 кг гавна",
                "price": 120,
                "rating": 0,
                "img": "935505b7-17de-4794-9abc-b1d2156c7df9.png",
                typeId:4
            },
            {
                "id": 3,
                "name": "110 кг гавна",
                "price": 5,
                "rating": 0,
                "img": "6bb77954-334d-4e05-85c8-c1d39c41a4c2.png",
                typeId:4
            },
            {
                "id": 4,
                "name": "110 кг гавна",
                "price": 50,
                "rating": 0,
                "img": "bcca1ad5-09f9-496b-9577-81b5a18ff378.png",
                typeId:4
            },*/
        ]
        this._selectedType = {}

        makeAutoObservable(this)
    }

    setTypes(types){
        this._types = types
    }
    setItems(items){
        this._items = items
    }
    setSelectedType(type){
        this._selectedType = type
    }
    get types(){
        return this._types
    }
    get items(){
        return this._items
    }
    get selectedType()
    {
        return this._selectedType 
    }
}