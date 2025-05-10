const uuid = require('uuid');
const path = require('path');
const sequelize = require('../db');

const fs = require('fs');
const { Item,ItemInfo, BasketItem,ItemImage,Type,Color,Order,ColorItemConnector  } = require('../models/models');
const ApiError = require('../error/ApiError');

class ItemController {
    async create(req, res, next) {
        let fileRecords = []; 
        let item = null;
        let errorText='';
        try {
            let { name, price, typeId, info, colorIds } = req.body;
            let img = req.files?.img;
            if (!name) return next(ApiError.light("Введите название товара"));
            if (!price) return next(ApiError.light("Введите цену товара"));
            if (!img) return next(ApiError.light("Добавьте хотя бы одно изображение"));
            if (!info) return next(ApiError.light("Добавьте описание товара"));
            if (!colorIds) return next(ApiError.light("Укажите хотя бы один цвет"));
            if (!typeId) return next(ApiError.light("Укажите тип товара"));
            // Проверка типа
            const type = await Type.findOne({ where: { id:typeId } });
            if (!type) {
                return next(ApiError.light("Нет такого типа"));
            }
    
           
            // Создание Item
            item = await Item.create({ name, price, typeId:type.id });
            // Обработка изображений
            img = Array.isArray(img) ? img : [img];
            if (img && Array.isArray(img)) {
                for (let i = 0; i < img.length; i++) {
                    let fileName = uuid.v4() + ".png";
                    let filePath = path.resolve(__dirname, '..', 'static', fileName);
    
                    await img[i].mv(filePath); // Если упадёт — попадёт в catch
    
                    fileRecords.push({ filePath, fileName });
    
                    await ItemImage.create({
                        img: fileName,
                        itemId: item.id
                    });
                }
            } else {
                errorText="Укажите хотя бы одно фото";
                throw new Error(errorText);  
            }
    
            // Обработка info
            if (info) {
                const parsed = JSON.parse(info);
                await Promise.all(parsed.map(i =>{
                    if(i.title!=='' && i.discription!==''){
                        return ItemInfo.create({
                        title: i.title,
                        discription: i.discription,
                        itemId: item.id
                    })
                }else{
                    errorText="Укажите Заголовок и Содержание";
                    throw new Error(errorText);  

                }
            }
                ));
            }else{
                errorText="Укажите хотя бы одно поле описания";
                throw new Error(errorText);  

            }
            
            // Обработка цветов (если переданы colorIds как JSON-массив)
            if (colorIds) {
                const colors = JSON.parse(colorIds);
                await Promise.all(colors.map(colorId =>
                    ColorItemConnector.create({ itemId: item.id, colorId })
                ));
            }else{
                await Item.destroy({ where: { id: item.id } });
                return next(ApiError.light("Укажите хотя бы один цвет"));
            }
            
            // Возврат полного объекта
        const fullItem = await Item.findOne({
            where: { id: item.id },
            include: [
                { model: ItemInfo, as: 'info' },
                { 
                    model: ItemImage, 
                    as: 'imgs',
                    separate: true, // сортировка работает только при separate
                    order: [['id', 'ASC']]
                },
                { model: Color, as: 'colors' }
            ]
        });
    
            return res.json(fullItem);
    
        } catch (e) {
            console.error(errorText? errorText: ("Ошибка при создании товара:", e.message));
    
            // Удаляем загруженные файлы
            fileRecords.forEach(({ filePath }) => {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });
    
            // Удаляем всё связанное с item
            if (item && item.id) {
                try {
                    await ItemImage.destroy({ where: { itemId: item.id } });
                    await ItemInfo.destroy({ where: { itemId: item.id } });
                    await ColorItemConnector.destroy({ where: { itemId: item.id } });
                    await Item.destroy({ where: { id: item.id } });
                } catch (cleanupError) {
                    console.error("Ошибка при очистке базы:", cleanupError.message);
                }
            }
    
            return next(ApiError.light(e.message));
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
            where: { id: item.id },
            include: [
                { model: ItemInfo, as: 'info' },
                { 
                    model: ItemImage, 
                    as: 'imgs',
                    separate: true, // сортировка работает только при separate
                    order: [['id', 'ASC']]
                },
                { model: Color, as: 'colors' }
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
                    { model: ItemImage, as: 'imgs', required: false }, // Включаем данные imgs
                    { model: Color, as: 'colors', required: false  }
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
            if(!id){
                next(ApiError.badRequest( "Товар не найден" ));
            }
            // Запрос к базе данных с использованием единого include
            const item = await Item.findOne({
                where: { id },
                include: [
                    { model: ItemInfo, as: 'info' }, // Включаем связанные данные info
                    { model: ItemImage, as: 'imgs' }, // Включаем связанные данные imgs
                    { model: Color, as: 'colors' }
                ]
            });
            if(!item){
                next(ApiError.badRequest( "Товар не найден" ));
            }
            // Возвращаем найденный предмет
            return res.json(item);
        } catch (e) {
            // Обработка ошибок
            next(ApiError.badRequest(e.message));
        }
    }
    
    async deleteOne(req, res, next) {
        try {
            const { itemId } = req.body;
            if (!itemId) return next(ApiError.light("ID товара не передан"));
    
            // Находим товар и связанные заказы
            const item = await Item.findOne({
                where: { id: itemId },
                include: [
                    { model: Order },
                    { model: ItemInfo, as: 'info' },
                    { model: ItemImage, as: 'imgs' },
                    { model: Color, as: 'colors' },
                    { model: BasketItem }
                ]
            });
    
            if (!item) return next(ApiError.light("Товар не найден"));
    
            // Проверка: если есть связанные заказы, запрещаем удаление
            if (item.Orders && item.Orders.length > 0) {
                return next(ApiError.light(`Невозможно удалить товар: найдено ${item.Orders.length} заказ(ов), связанных с этим товаром`));
            }
    
            // Удаление изображений с диска
            if (item.imgs?.length > 0) {
                for (const img of item.imgs) {
                    const filePath = path.resolve(__dirname, '..', 'static', img.img);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
            }
    
            // Удаление связей с цветами через таблицу-связку
            if (item.colors?.length > 0) {
                await item.removeColors(item.colors);
            }
    
            // Удаление зависимых данных
            await ItemImage.destroy({ where: { itemId } });
            await ItemInfo.destroy({ where: { itemId } });
            await BasketItem.destroy({ where: { itemId } });
    
            // Удаление самого Item
            await Item.destroy({ where: { id: itemId } });
    
            return res.json({ message: "Товар и все связанные данные успешно удалены" });
        } catch (e) {
            next(ApiError.internal("Ошибка при удалении товара: " + e.message));
        }
    }

    async updateItem(req, res, next) {
        const t = await sequelize.transaction();
        let fileRecords = []; // Новые файлы
        let filesToDelete = []; // Старые файлы (удалим только после успеха)
       
        try {
            const itemId = req.params.id;
            if (!itemId) throw new Error("Не указан ID товара");
    
            const existingItem = await Item.findByPk(itemId, { transaction: t });
            if (!existingItem) throw new Error("Товар не найден");
    
            let { name, price, typeId, info, colorIds, oldImg } = req.body;
            let img = req.files?.img;
            if (!name) return next(ApiError.light("Введите название товара"));
            if (!price) return next(ApiError.light("Введите цену товара"));
            // Обработка изображений
            oldImg = oldImg ? JSON.parse(oldImg) : [];
            const oldImages = await ItemImage.findAll({ where: { itemId }, transaction: t });
    
            // Считаем количество изображений для сохранения
            const newImgCount = img ? (Array.isArray(img) ? img.length : 1) : 0;
            const oldImgCount = oldImg.length;
    
            // Если нет ни одного изображения, выбрасываем ошибку
            if (oldImgCount + newImgCount === 0) {
                throw new Error("Хотя бы одно изображение должно быть прикреплено");
            }
    
            // Делаем Set для старых изображений, которые нужно оставить
            const imagesToKeep = new Set(oldImg); // храним только имена файлов
            const imagesToDelete = oldImages.filter(({ img }) => !imagesToKeep.has(img));
            filesToDelete = imagesToDelete.map(({ img }) => path.resolve(__dirname, '..', 'static', img));
    
            // Удалим из БД только те изображения, которых нет в сохранённых
            await ItemImage.destroy({
                where: {
                    itemId,
                    img: imagesToDelete.map(i => i.img)
                },
                transaction: t
            });
    
            // Добавим новые изображения
            if (img) {
                if (!Array.isArray(img)) img = [img];
                for (const image of img) {
                    const fileName = uuid.v4() + ".png";
                    const filePath = path.resolve(__dirname, '..', 'static', fileName);
                    await image.mv(filePath);
                    fileRecords.push(filePath);
    
                    await ItemImage.create({ img: fileName, itemId }, { transaction: t });
                }
            }
    
            // Обработка основных данных
            if (name) existingItem.name = name;
            if (price) existingItem.price = price;
            if (typeId) {
                const type = await Type.findOne({ where: { id: typeId }, transaction: t });
                if (!type) throw new Error("Тип товара не найден");
                existingItem.typeId = type.id;
            }
            await existingItem.save({ transaction: t });
    
            // Обработка описания
            if (info) {
                const parsed = JSON.parse(info);
                await ItemInfo.destroy({ where: { itemId }, transaction: t });
    
                await Promise.all(parsed.map(i => {
                    if (i.title && i.discription) {
                        return ItemInfo.create({
                            title: i.title,
                            discription: i.discription,
                            itemId
                        }, { transaction: t });
                    } else {
                        throw new Error("Укажите Заголовок и Содержание");
                    }
                }));
            }
    
            // Обновление цветов
            if (colorIds) {
                const parsed = JSON.parse(colorIds);
                await ColorItemConnector.destroy({ where: { itemId }, transaction: t });
    
                await Promise.all(parsed.map(colorId =>
                    ColorItemConnector.create({ itemId, colorId }, { transaction: t })
                ));
            }
    
            await t.commit();
    
            // Удаляем ненужные файлы
            filesToDelete.forEach(fp => {
                if (fs.existsSync(fp)) fs.unlinkSync(fp);
            });
    
            const fullItem = await Item.findOne({
            where: { id: itemId },
            include: [
                { model: ItemInfo, as: 'info' },
                { 
                    model: ItemImage, 
                    as: 'imgs',
                    separate: true, // сортировка работает только при separate
                    order: [['id', 'ASC']]
                },
                { model: Color, as: 'colors' }
            ]
        });
    
            return res.json(fullItem);
    
        } catch (e) {
            if (t) await t.rollback();
    
            fileRecords.forEach(fp => {
                if (fs.existsSync(fp)) fs.unlinkSync(fp);
            });
    
            return next(ApiError.light("Ошибка: " + e.message));
        } finally {
            filesToDelete.forEach(fp => {
                if (fs.existsSync(fp)) fs.unlinkSync(fp);
            });
        }
    }
    
    

//colors
async addColor(req, res, next) {
    try {
        // Извлекаем данные из запроса
        const { itemId, colorId } = req.body;

        // Проверяем наличие предмета
        const item = await Item.findOne({ where: { id: itemId } });
        if (!item) {
            return next(ApiError.badRequest("Item not found"));
        }

        // Проверяем наличие цвета
        const color = await Color.findOne({ where: { id: colorId } });
        if (!color) {
            return next(ApiError.badRequest("Color not found"));
        }

        // Добавляем связь между Item и Color
        await item.addColor(color);

        // Получаем обновленный объект Item с ассоциациями
        const fullItem = await Item.findOne({
            where: { id: itemId },

           

            include: [
                { model: ItemInfo, as: 'info' },
                { 
                    model: ItemImage, 
                    as: 'imgs',
                    separate: true, // сортировка работает только при separate
                    order: [['id', 'ASC']]
                },
                { model: Color, as: 'colors' }
            ]
            
        });

        // Возвращаем полный объект
        return res.json(fullItem);
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
}

async removeColor(req, res, next) {
    try {
        // Извлекаем данные из запроса
        const { itemId, colorId } = req.body;

        // Проверяем наличие предмета
        const item = await Item.findOne({ where: { id: itemId } });
        if (!item) {
            return next(ApiError.badRequest("Item not found"));
        }

        // Проверяем наличие цвета
        const color = await Color.findOne({ where: { id: colorId } });
        if (!color) {
            return next(ApiError.badRequest("Color not found"));
        }

        // Удаляем связь между Item и Color
        await item.removeColor(color);

        // Получаем обновленный объект Item с ассоциациями
        const fullItem = await Item.findOne({
            where: { id: itemId },
            include: [
                { model: ItemInfo, as: 'info' },
                { 
                    model: ItemImage, 
                    as: 'imgs',
                    separate: true, // сортировка работает только при separate
                    order: [['id', 'ASC']]
                },
                { model: Color, as: 'colors' }
            ]
        });

        // Возвращаем обновленный объект
        return res.json(fullItem);
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
}



}
module.exports = new ItemController();
