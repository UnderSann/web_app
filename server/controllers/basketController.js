const { Basket, BasketItem, Item } = require('../models/models');
const ApiError = require('../error/ApiError');

class BasketController {
    // Получить корзину пользователя
    async getBasket(req, res,next) {
        try {
            let { limit, page } = req.query;
            const {userId} = req.params
            let basket = await Basket.findOne({ where: { userId } });
            page = page || 1;
            limit = limit || 10;
            let offset = page * limit - limit;
            const basketItems = await BasketItem.findAndCountAll({
                where: { basketId: basket.id },
                limit,
                offset,
                include: [{ model: Item }] // Подгружаем информацию о товаре
            });
            
            return res.json(basketItems);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    

    // Добавить товар в корзину
    async addToBasket(req, res, next) {
        try {
            const { userId, itemId, quantity = 1 } = req.body;

            // Находим корзину пользователя или создаем, если её нет
            let basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                basket = await Basket.create({ userId });
            }

            // Проверяем, есть ли уже этот товар в корзине
            let basketItem = await BasketItem.findOne({ where: { basketId: basket.id, itemId } });

            if (basketItem) {
                basketItem.quantity += quantity; // Увеличиваем количество
                await basketItem.save();
            } else {
                basketItem = await BasketItem.create({ basketId: basket.id, itemId, quantity });
            }

            return res.json(basketItem);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    // Удалить один товар из корзины
    async removeFromBasket(req, res, next) {
        try {
            const { userId, itemId } = req.body;

            const basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                return  next(ApiError.badRequest({message: "Корзина не найдена" }));
            }

            const basketItem = await BasketItem.findOne({ where: { basketId: basket.id, itemId } });

            if (!basketItem) {
                return  next(ApiError.badRequest({message: "Товар не найден в корзине" }));
            }

            await basketItem.destroy();

            return res.json({ message: "Товар удален из корзины" });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    // Очистить корзину пользователя
    async clearBasket(req, res, next) {
        try {
            const { userId } = req.params;

            const basket = await Basket.findOne({ where: { userId } });

            if (!basket) {
                return  next(ApiError.badRequest({message: "Товар не найден в корзине" }));
            }

            await BasketItem.destroy({ where: { basketId: basket.id } });

            return res.json({ message: "Корзина очищена" });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new BasketController();
