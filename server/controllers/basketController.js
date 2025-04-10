const { Basket, BasketItem, Item, ItemImage, ItemInfo } = require('../models/models');
const ApiError = require('../error/ApiError');

class BasketController {
    // Получить корзину пользователя
    async getBasket(req, res, next) {
        try {
            const { userId } = req.params;
            if (!userId) {
                return next(ApiError.light("Вы не авторизованы"));
            }

            let { limit, page } = req.query;
            page = page || 1;
            limit = limit || 10;
            const offset = (page - 1) * limit;

            let basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                return res.json({ rows: [], count: 0 }); 
            }

            const basketItems = await BasketItem.findAndCountAll({
                where: { basketId: basket.id },
                limit,
                offset,
                distinct: true,
                order: [['createdAt', 'DESC']], 
                include: [
                    {
                        model: Item,
                        include: [
                            { model: ItemInfo, as: 'info' },
                            { model: ItemImage, as: 'imgs' }
                        ]
                    }
                ]
            });

            return res.json(basketItems);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async fetchOne(req, res, next) {
        try {
            const { userId, itemId } = req.params;

            if (!userId) return next(ApiError.light("Вы не авторизованы"));
            if (!itemId) return next(ApiError.light("Ошибка выбора товара"));

            const basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                return res.json({ item: null });
            }

            const basketItem = await BasketItem.findOne({
                where: { basketId: basket.id, itemId },
                include: [
                    {
                        model: Item,
                        include: [
                            { model: ItemInfo, as: 'info' },
                            { model: ItemImage, as: 'imgs' },
                        ]
                    }
                ]
            });

            return res.json(basketItem);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    // Добавить товар в корзину
    async addToBasket(req, res, next) {
        try {
            let { userId, itemId, page = 1, limit = 10, quantity = 1 } = req.body;

            if (!userId) return next(ApiError.light("Вы не авторизованы"));
            if (!itemId) return next(ApiError.light("Ошибка выбора товара"));

            let basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                basket = await Basket.create({ userId });
            }

            let basketItem = await BasketItem.findOne({ where: { basketId: basket.id, itemId } });

            if (basketItem) {
                basketItem.quantity += quantity;
                await basketItem.save();
            } else {
                basketItem = await BasketItem.create({ basketId: basket.id, itemId, quantity });
            }

            const offset = (page - 1) * limit;

            const basketItems = await BasketItem.findAndCountAll({
                where: { basketId: basket.id },
                limit,
                offset,
                distinct: true,
                order: [['createdAt', 'DESC']], 
                include: [
                    {
                        model: Item,
                        include: [
                            { model: ItemInfo, as: 'info' },
                            { model: ItemImage, as: 'imgs' }
                        ]
                    }
                ]
            });

            return res.json(basketItems);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    // Удалить один товар из корзины
    async removeFromBasket(req, res, next) {
        try {
            const { userId, itemId, page = 1, limit = 10, toClear } = req.body;

            if (!userId) return next(ApiError.light("Вы не авторизованы"));
            if (!itemId) return next(ApiError.light("Ошибка выбора товара"));

            const basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                return next(ApiError.light("Корзина не найдена"));
            }

            const basketItem = await BasketItem.findOne({ where: { basketId: basket.id, itemId } });

            if (!basketItem) {
                return next(ApiError.light("Товар не найден в корзине"));
            }

            if (toClear) {
                basketItem.quantity = 1;
            }

            if (--basketItem.quantity <= 0) {
                await basketItem.destroy();
            } else {
                await basketItem.save(); 
            }

            const offset = (page - 1) * limit;

            const basketItems = await BasketItem.findAndCountAll({
                where: { basketId: basket.id },
                limit,
                offset,
                distinct: true,
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: Item,
                        include: [
                            { model: ItemInfo, as: 'info' },
                            { model: ItemImage, as: 'imgs' }
                        ]
                    }
                ]
            });

            return res.json(basketItems);

        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    // Очистить корзину пользователя
    async clearBasket(req, res, next) {
        try {
            const { userId } = req.body;

            if (!userId) return next(ApiError.light("Вы не авторизованы"));

            const basket = await Basket.findOne({ where: { userId } });

            if (!basket) {
                return next(ApiError.light("Корзина не найдена"));
            }

            await BasketItem.destroy({ where: { basketId: basket.id } });

            return res.json({ message: "Корзина очищена" });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new BasketController();
