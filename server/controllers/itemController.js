const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const { Item,ItemInfo } = require('../models/models');
const ApiError = require('../error/ApiError');

class ItemController {
    async create(req, res, next) {
        let filePath; // Объявляем заранее
        try {
            let { name, price, typeId, info } = req.body;
            const { img } = req.files;
    
            if (!img) {
                return next(ApiError.badRequest("Изображение не загружено"));
            }
    
            let fileName = uuid.v4() + ".png";
            filePath = path.resolve(__dirname, '..', 'static', fileName);
    
            // Создаем объект в БД
            const item = await Item.create({ name, price, typeId, img: fileName });
    
            // Только после успешного создания в БД загружаем файл
            await img.mv(filePath);
    
            // Обработка информации, если есть
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
    
            return res.json(item);
        } catch (e) {
            // Удаляем загруженное изображение, если оно уже было сохранено
            if (filePath && fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            
            next(ApiError.badRequest(e.message));
        }
    }
    async getAll(req, res) {
        let {typeId,limit,page} = req.query
        page=page || 1
        limit = limit || 10
        let offset = page * limit - limit
        let items;
        if(!typeId){
            items = await Item.findAndCountAll({limit,offset})
        }
        else{
            items = await Item.findAndCountAll({where:{typeId},limit,offset})
        }
        return res.json(items)
    }

    async getOne(req, res) {
       const {id} = req.params
       const item = await Item.findOne({
        where: { id },
        include: [{ model: ItemInfo, as: 'info' }]
        },
    )
       return res.json(item)
    }
    async deleteOne(req, res, next) {
        try {
            const { id } = req.params;
    
            // Находим объект по id, включая связанную информацию
            const item = await Item.findOne({
                where: { id },
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
            await ItemInfo.destroy({ where: { itemId: id } });
    
            // Удаляем сам Item
            await Item.destroy({ where: { id } });
    
            return res.json({ message: "Товар успешно удален" });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    
}
module.exports = new ItemController();
