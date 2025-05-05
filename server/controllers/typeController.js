const {Type,Item} = require('../models/models')
const ApiError = require('../error/ApiError')
class TypeController{
    async create(req,res,next){
        try {
            const { name } = req.body;
            if (!name) return next(ApiError.light("Введите название типа"));
           // if (!typeId) return next(ApiError.light("Укажите номер типа"));
            const existingType = await Type.findOne({ where: { name } });
            if (existingType) {
                return next(ApiError.light('Название типа уже существует'));
            }
            const type = await Type.create({ name });
            return res.json(type);
        } catch (e) {
            return next(ApiError.light('Произошла ошибка при создании типа\n'+e));
        }
    }
    async getAll(req,res){
        const types = await Type.findAll()
        return res.json(types)
    }
    async delete(req, res, next) {
        try {
            const { id } = req.body;
            if (!id) return next(ApiError.light("ID типа не передан"));
    
            const type = await Type.findByPk(id);
            if (!type) return next(ApiError.light("Тип не найден"));
    
            // Проверяем наличие связанных товаров
            const itemsWithType = await Item.findAndCountAll({ where: { typeId: type.id } });
            if (itemsWithType.count) {
                return next(ApiError.light(`Невозможно удалить тип: найдено ${itemsWithType.count} товар(ов), связанных с этим типом`));
            }
    
            await type.destroy();
            return res.json({ message: "Тип успешно удалён" });
        } catch (e) {
            return next(ApiError.internal("Ошибка при удалении типа: " + e.message));
        }
    }
    
}
module.exports=new TypeController()