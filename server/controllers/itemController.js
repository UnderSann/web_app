const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const { Item,ItemInfo, BasketItem,ItemImage } = require('../models/models');
const ApiError = require('../error/ApiError');

class ItemController {
    async create(req, res, next) {
        let filePath; // Объявляем заранее
        try {
            let { name, price, typeId, info } = req.body;
            const { img } = req.files;
    
            // Создаём Item
            const item = await Item.create({ name, price, typeId });
    
            // Обработка изображения
            if (img) {
                let fileName = uuid.v4() + ".png";
                filePath = path.resolve(__dirname, '..', 'static', fileName);
                await img.mv(filePath); // Сохранение файла
                // Создание записи в таблице ItemImage
                await ItemImage.create({
                    img: fileName,
                    itemId: item.id
                });
            }
    
            // Обработка информации info, если она есть
            if (info) {
                info = JSON.parse(info);
                await Promise.all(info.map(i =>
                    ItemInfo.create({
                        title: i.title,
                        discription: i.discription,
                        itemId: item.id
                    })
                ));
            }
    
            // Запрос для возврата item с info и ItemImage
            const fullItem = await Item.findOne({
                where: { id: item.id },
                include: [
                    { model: ItemInfo, as: 'info' }, // Включаем связанные данные info
                    { model: ItemImage, as:"imgs" } // Включаем связанные данные ItemImage
                ]
            });
    
            return res.json(fullItem);
        } catch (e) {
            // Удаляем загруженное изображение, если оно уже было сохранено
            if (filePath && fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
    
            next(ApiError.badRequest(e.message));
        }
    }
    
    async addImg(req, res, next) {
        let filePath; // Объявляем заранее
        try {
            let { itemId } = req.body;
            const { img } = req.files;
    
            // Проверяем наличие предмета
            const item = await Item.findOne({ where: { id: itemId } });
            if (!item) {
                return next(ApiError.badRequest("Item not found")); // Если предмет не найден
            }
    
            // Обработка изображения
            if (img) {
                let fileName = uuid.v4() + ".png";
                filePath = path.resolve(__dirname, '..', 'static', fileName);
                await img.mv(filePath); // Сохраняем файл
                // Создаём запись в таблице ItemImage
                await ItemImage.create({
                    img: fileName, // Сохраняем имя файла
                    itemId // Связываем с Item
                });
            }
    
            // Запрос для возврата item с info и ItemImage
            const fullItem = await Item.findOne({
                where: { id: itemId },
                include: [
                    { model: ItemInfo, as: 'info' }, // Ассоциация info
                    { model: ItemImage, as: 'imgs' } // Ассоциация imgs
                ]
            });
    
            // Возвращаем полный объект с изображениями и инфо
            return res.json(fullItem);
        } catch (e) {
            // Удаляем загруженное изображение, если оно уже было сохранено
            if (filePath && fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
    
            next(ApiError.badRequest(e.message));
        }
    }
    
    async getAll(req, res, next) {
        try {
            let { typeId, limit, page } = req.query;
    
            // Устанавливаем значения по умолчанию
            page = page || 1;
            limit = limit || 10;
            let offset = (page - 1) * limit;
    
            // Определяем, какие данные загружать
            const options = {
                limit,
                offset,
                include: [
                    { model: ItemInfo, as: 'info' }, // Включаем связанные данные info
                    { model: ItemImage, as: 'imgs' } // Включаем связанные данные imgs
                ]
            };
    
            if (typeId) {
                // Если typeId указан, добавляем условие
                options.where = { typeId };
            }
    
            // Получаем предметы с подсчётом общего количества
            const items = await Item.findAndCountAll(options);
    
            return res.json(items);
        } catch (e) {
            // Обработка ошибок
            next(ApiError.badRequest(e.message));
        }
    }
    

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
    
            // Запрос к базе данных с использованием единого include
            const item = await Item.findOne({
                where: { id },
                include: [
                    { model: ItemInfo, as: 'info' }, // Включаем связанные данные info
                    { model: ItemImage, as: 'imgs' } // Включаем связанные данные imgs
                ]
            });
    
            // Возвращаем найденный предмет
            return res.json(item);
        } catch (e) {
            // Обработка ошибок
            next(ApiError.badRequest(e.message));
        }
    }
    
    async deleteOne(req, res, next) {
        try {
            const { userId,itemId } = req.body;
    
            // Находим объект по id, включая связанную информацию
            const item = await Item.findOne({
                where: { id:itemId },
                include: [{ model: ItemInfo, as: 'info' }]
            });
    
            if (!item) {
                return res.status(404).json({ message: "Товар не найден" });
            }
    
            // Удаляем файл изображения, если он есть
            if (item.img) {
                const filePath = path.resolve(__dirname, '..', 'static', item.img);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
    
            // Удаляем связанные записи из ItemInfo
            await ItemInfo.destroy({ where: { id:itemId } });
            await BasketItem.destroy({ where: { basketId:userId, itemId } });
            // Удаляем сам Item
            await Item.destroy({ where: { id:itemId } });
    
            return res.json({ message: "Товар успешно удален" });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    
}
module.exports = new ItemController();
