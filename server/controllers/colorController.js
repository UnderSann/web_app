const {Color} = require('../models/models')
const ApiError = require('../error/ApiError');

class ColorController{
async create (req, res,next){
    try {
        const {name, code} =req.body
        const color = await Color.create({
            name,
            code
        });
        if(color){
            next(ApiError.badRequest('Цвет добавлен'));
        }
    } catch (e) {
         next(ApiError.badRequest('Ошибка при добавлении цвета:'+ e.message));
    }
};
async fetchAll (req, res,next){
    try {
        const colors = await Color.findAll();
        return res.json(colors)
    } catch (e) {
         next(ApiError.badRequest('Ошибка: '+e.message));
    }
    };
    
//Доделать!!!!!!!!!!!!!!!!
async delete (req, res,next){
try {
    const {id} =req.body
    const color = await Color.findOne({where:{id} });
    if(!color){
        next(ApiError.badRequest('Цвет не выбран или отсутсвует' ));
    }
    color.destroy()
    return res.json({message:"Успешно удалено"});
} catch (e) {
     next(ApiError.badRequest('Ошибка удаления'+e.message));
}
};



}
module.exports=new ColorController()