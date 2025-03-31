const { Order, Item, User, ItemImage } = require('../models/models');
const ApiError = require('../error/ApiError');

class OrderController {
    // Создание заказа
    async create(req, res, next) {
        try {
            const { userId, itemId, quantity, text, insta, tg } = req.body;

            if (!quantity || quantity <= 0) {
                return next(ApiError.badRequest('Укажите количество'));
            }

            // Проверяем существование пользователя
            const user = await User.findByPk(userId);
            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'));
            }

            // Проверяем существование товара
            const item = await Item.findOne({
                where: { id: itemId },
                include: [
                    { model: ItemImage, as: 'imgs' }
                ]
            });
            if (!item) {
                return next(ApiError.notFound('Товар не найден'));
            }

            // Создаём заказ
            const order = await Order.create({
                userId,
                itemId,
                quantity,
                text,
                insta,
                tg
            });

            return res.json(order);
        } catch (e) {
            return next(ApiError.internal('Ошибка при создании заказа, проверьте поля'));
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
            return next(ApiError.internal('Ошибка при удалении заказа'));
        }
    }
    
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { quantity, text, insta, tg } = req.body;
    
            const order = await Order.findByPk(id);
            if (!order) {
                return next(ApiError.notFound('Заказ не найден'));
            }
    
            // Обновляем только переданные поля
            await order.update({
                quantity: quantity !== undefined ? quantity : order.quantity,
                text: text !== undefined ? text : order.text,
                insta: insta !== undefined ? insta : order.insta,
                tg: tg !== undefined ? tg : order.tg
            });
    
            return res.json(order);
        } catch (e) {
            return next(ApiError.internal('Ошибка при обновлении заказа'));
        }
    }
}

module.exports = new OrderController();
