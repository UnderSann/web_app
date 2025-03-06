const {Type} = require('../models/models')
const ApiError = require('../error/ApiError')
class TypeController{
    async create(req,res,next){
        try {
            const { name } = req.body;
            const existingType = await Type.findOne({ where: { name } });
            if (existingType) {
                return next(ApiError.badRequest('Тип уже существует'));
            }
            const type = await Type.create({ name });
            return res.json(type);
        } catch (e) {
            return next(ApiError.internal('Произошла ошибка при создании типа'));
        }
    }
    async getAll(req,res){
        const types = await Type.findAll()
        return res.json(types)
    }
}
module.exports=new TypeController()