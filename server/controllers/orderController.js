const { Order, Item, User, ItemImage, Color } = require('../models/models');
const ApiError = require('../error/ApiError');
const { isValidPhoneNumber } = require('libphonenumber-js');
class OrderController {
    // Создание заказа
    async create(req, res, next) {
        try {
            const { userId, itemId, colorId, quantity, text, insta, number } = req.body;

            if (!quantity || quantity <= 0) {
                return next(ApiError.badRequest('Укажите количество'));
            }
            if (!colorId) {
                return next(ApiError.badRequest('Укажите цвет'));
            }
            if (!number) {
                return next(ApiError.badRequest('Укажите номер телефона'));
            }
            
            // Проверяем существование пользователя
            const user = await User.findByPk(userId);
            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'));
            }

            // Проверяем существование товара
            const item = await Item.findOne({
                where: { id: itemId },
                include: [{ model: ItemImage, as: 'imgs' }]
            });
            if (!item) {
                return next(ApiError.notFound('Товар не найден'));
            }

            // Проверяем существование цвета
            const color = await Color.findByPk(colorId);
            if (!color) {
                return next(ApiError.notFound('Цвет не найден'));
            }

            // Создаём заказ
            const order = await Order.create({
                userId,
                itemId,
                colorId,
                quantity,
                text,
                insta,
                number
            });

            return res.json(order);
        } catch (e) {
            return next(ApiError.internal('Ошибка при создании заказа, проверьте поля'));
        }
    }

    async fetchAllUsers(req, res, next) {
        try {
            const { userId } = req.params; // Приводим к числу
            if (!userId) {
                return next(ApiError.badRequest("Некорректный userId"));
            }
    
            const orders = await Order.findAll({
                where: { userId },
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: Item,
                        include: [
                            { model: ItemImage, as: 'imgs' } // Вложенный include внутри Item
                        ]
                    },
                    {
                        model: Color
                    }
                ]
            });
    
            return res.json(orders);
        } catch (e) {
            next(ApiError.badRequest('Ошибка: ' + e.message));
        }
    }
    

    async fetchAll(req, res, next) {
        try {
            let { limit, page } = req.query;
            page = page || 1;
            limit = limit || 10;
            const offset = (page - 1) * limit;
            const orders = await Order.findAndCountAll({
                limit,
                offset,
                distinct: true,
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: Item,
                        include: [
                            { model: ItemImage, as: 'imgs' }
                        ]
                    },
                    {
                        model: Color
                    }
                ]
            });
    
            return res.json(orders);
        } catch (e) {
            next(ApiError.badRequest('Ошибка: ' + e.message));
        }
    }
    
    async inWork(req, res, next) {
        try {
            let { orderId, limit, page } = req.body;
            console.log('\n'+orderId+'\n')
            page = parseInt(page) || 1;
            limit = parseInt(limit) || 10;
    
            if (!orderId) {
                return next(ApiError.badRequest('Заказ не найден'));
            }
    
            // Найти заказ и инвертировать confirmed
            const order = await Order.findOne({ where: { id: orderId } })
            if (!order) {
                return next(ApiError.badRequest('Заказ с таким ID не найден'));
            }
    
            order.comfirmed = !order.comfirmed;
            await order.save();
    
            const offset = (page - 1) * limit;
            const orders = await Order.findAndCountAll({
                limit,
                offset,
                distinct: true,
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: Item,
                        include: [
                            { model: ItemImage, as: 'imgs' }
                        ]
                    },
                    {
                        model: Color
                    }
                ]
            });
    
            return res.json(orders);
        } catch (e) {
            next(ApiError.badRequest('Ошибка: ' + e.message));
        }
    }

    async isDone(req, res, next) {
        try {
            let { orderId, limit, page } = req.body;
            page = parseInt(page) || 1;
            limit = parseInt(limit) || 10;
    
            if (!orderId) {
                return next(ApiError.badRequest('Заказ не найден'));
            }
    
            // Найти заказ и инвертировать confirmed
            const order = await Order.findOne({ where: { id: orderId } })
            if (!order) {
                return next(ApiError.badRequest('Заказ с таким ID не найден'));
            }
    
            order.done = !order.done;
            await order.save();
    
            const offset = (page - 1) * limit;
            const orders = await Order.findAndCountAll({
                limit,
                offset,
                distinct: true,
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: Item,
                        include: [
                            { model: ItemImage, as: 'imgs' }
                        ]
                    },
                    {
                        model: Color
                    }
                ]
            });
    
            return res.json(orders);
        } catch (e) {
            next(ApiError.badRequest('Ошибка: ' + e.message));
        }
    }

    // Удаление заказа
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const order = await Order.findOne({ where: { id } });
            if (!order) {
                return next(ApiError.notFound('Заказ не найден'));
            }

            await order.destroy();
            return res.json({ message: 'Заказ успешно удален' });
        } catch (e) {
            return next(ApiError.badRequest('Ошибка при удалении заказа:'+e.message));
        }
    }

    async update(req, res, next) {
        try {
            const { id, quantity, text, insta, number, colorId } = req.body;

            const order = await Order.findByPk(id);
            if (!order) {
                return next(ApiError.notFound('Заказ не найден'));
            }
            
            // Проверяем новый цвет, если он передан
            if (colorId !== undefined) {
                const color = await Color.findByPk(colorId);
                if (!color) {
                    return next(ApiError.notFound('Цвет не найден'));
                }
            }
            
            // Обновляем только переданные поля
            await order.update({
                quantity: quantity !== undefined ? quantity : order.quantity,
                text: text !== undefined ? text : order.text,
                insta: insta !== undefined ? insta : order.insta,
                number: number !== undefined ? number : order.number,
                colorId: colorId !== undefined ? colorId : order.colorId
            });

            return res.json(order);
        } catch (e) {
            return next(ApiError.internal('Ошибка при обновлении заказа'));
        }
    }
}

module.exports = new OrderController();