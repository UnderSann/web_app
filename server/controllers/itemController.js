const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const { Item,ItemInfo, BasketItem,ItemImage,Type } = require('../models/models');
const ApiError = require('../error/ApiError');

class ItemController {
    async create(req, res, next) {
        let filePath; // Объявляем заранее
        try {
            let { name, price, typeId, info } = req.body;
            const { img } = req.files;
            const type= await Type.findOne({where:{typeId}})
            if(!type){
                return next(ApiError.badRequest("Нет такого типа"));
            }
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
            else{
                return next(ApiError.badRequest("Укажите фото"));
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
            else{
                await ItemInfo.create({
                        title:"",
                        discription: "",
                        itemId: item.id
                    })
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

    async deleteImg(req, res, next) {
        try {
            const { itemId, imgId } = req.body; // Получаем itemId и imgId из тела запроса
    
            // Проверяем наличие предмета
            const item = await Item.findOne({
                where: { id: itemId },
                include: [{ model: ItemImage, as: 'imgs' }] // Включаем связанные изображения
            });
    
            if (!item) {
                return next(ApiError.badRequest("Item not found")); // Если предмет не найден
            }
    
            // Проверяем наличие изображения
            const img = await ItemImage.findOne({ where: { id: imgId, itemId } });
            if (!img) {
                return next(ApiError.badRequest("Image not found")); // Если изображение не найдено
            }
    
            // Удаляем файл изображения
            const filePath = path.resolve(__dirname, '..', 'static', img.img);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // Удаляем файл
            }
    
            // Удаляем запись изображения из базы данных
            await ItemImage.destroy({ where: { id: imgId } });
    
            // Обновляем список всех оставшихся изображений для товара
            const remainingImages = await ItemImage.findAll({ where: { itemId } });
    
            // Возвращаем оставшиеся изображения
            return res.json(remainingImages);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    
    
    async getAll(req, res, next) {
        try {
            let { typeId, limit, page } = req.query;
    
            // Устанавливаем значения по умолчанию для пагинации
            page = page || 1;
            limit = limit || 10;
            let offset = (page - 1) * limit;
    
            // Опции для получения данных с использованием ассоциаций
            const options = {
                limit, 
                offset,
                distinct: true, // Уникальный подсчёт записей
                include: [
                    { model: ItemInfo, as: 'info', required: false }, // Включаем данные info
                    { model: ItemImage, as: 'imgs', required: false } // Включаем данные imgs
                ]
            };
    
            if (typeId) {
                // Добавляем условие фильтрации по typeId
                options.where = { typeId };
            }
    
            // Получаем предметы с подсчётом общего количества
            const items = await Item.findAndCountAll(options);
    
            // Проверяем наличие данных
            if (!items.rows.length) {
                return res.json({ count: 0, rows: [] }); // Если данных нет
            }
    
            return res.json(items);
        } catch (e) {
            // Ловим и возвращаем ошибки
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
            const { userId, itemId } = req.body;
    
            // Находим объект по id, включая связанные изображения
            const item = await Item.findOne({
                where: { id: itemId },
                include: [
                    { model: ItemInfo, as: 'info' }, // Ассоциация с ItemInfo
                    { model: ItemImage, as: 'imgs' } // Ассоциация с ItemImage
                ]
            });
    
            if (!item) {
                return res.status(404).json({ message: "Товар не найден" });
            }
    
            // Удаляем файлы всех связанных изображений
            if (item.imgs && item.imgs.length > 0) {
                for (const img of item.imgs) {
                    const filePath = path.resolve(__dirname, '..', 'static', img.img);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath); // Удаляем файл изображения
                    }
                }
            }
    
            // Удаляем связанные записи из ItemImage
            await ItemImage.destroy({ where: { itemId } });
    
            // Удаляем связанные записи из ItemInfo
            await ItemInfo.destroy({ where: { itemId } });
    
            // Удаляем записи из BasketItem
            await BasketItem.destroy({ where: { basketId: userId, itemId } });
    
            // Удаляем сам Item
            await Item.destroy({ where: { id: itemId } });
    
            return res.json({ message: "Товар и все связанные данные успешно удалены" });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async updateItem(req, res, next) {
        try {
            const { itemId, name, price, rating, typeId, info } = req.body; // Получаем параметры из тела запроса
    
            // Проверяем наличие itemId
            if (!itemId) {
                return next(ApiError.badRequest("Предмет не передан"));
            }
            const type= await Type.findOne({where:{typeId}})
            if(!type){
                return next(ApiError.badRequest("Нет такого типа"));
            }
            // Находим Item в базе данных
            const item = await Item.findOne({
                where: { id: itemId },
                include: [
                    { model: ItemInfo, as: 'info' }, // Включаем ItemInfo
                ]
            });
    
            if (!item) {
                return next(ApiError.badRequest("Предмет не найден не найден"));
            }
    
            // Обновляем данные Item, если указаны параметры
            const updatedFields = {};
            if (name) updatedFields.name = name;
            if (price) updatedFields.price = price;
            if (rating) updatedFields.rating = rating;
            if (typeId) updatedFields.typeId = typeId;
    
            await Item.update(updatedFields, { where: { id: itemId } });

            if (info && Array.isArray(info)) {
                for (const itemInfo of info) {
                    const { id, title, discription } = itemInfo;
    
                    if (id) {
                        // Обновляем существующую запись в ItemInfo
                        await ItemInfo.update(
                            { title, discription },
                            { where: { id } }
                        );
                    } else {
                        // Создаём новую запись в ItemInfo
                        await ItemInfo.create({
                            title,
                            discription,
                            itemId
                        });
                    }
                }
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
            next(ApiError.badRequest(e.message));
        }
    }
    /*
    async updateItemInfo(req, res, next) {
        try {
            const { itemId, title, discription } = req.body; // Получаем параметры из тела запроса
    

    
            // Находим запись ItemInfo по itemInfoId
            const itemInfo = await ItemInfo.findOne({ where: { itemId } });
            if (!itemInfo) {
                return next(ApiError.badRequest("Обьект не найден"));
            }
    
            // Обновляем запись в базе данных
            await ItemInfo.update(
                { title, discription }, // Новые значения
                { where: { itemId } } // Условие обновления
            );
    
            // Возвращаем обновлённую запись
            const updatedItemInfo = await ItemInfo.findOne({ where: { itemId } });
    
            return res.json(updatedItemInfo);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }*/
    
    
}


module.exports = new ItemController();
