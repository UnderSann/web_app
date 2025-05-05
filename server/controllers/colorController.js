const {Color} = require('../models/models')
const ApiError = require('../error/ApiError');

class ColorController{
async create (req, res,next){
    try {
        const {name, code} =req.body
        if (!name) return next(ApiError.light("Введите название цвета"));
        if (!code) return next(ApiError.light("Выберите цвет"));
        const checkName = await Color.findOne({where:{name}});
        if(checkName){
            next(ApiError.light('Элемент с таким именем существует' ));
        }
        const checkCode = await Color.findOne({where:{code}});
        if(checkCode){
            next(ApiError.light('Элемент с таким кодом уже существует' ));
        }
        const color = await Color.create({
            name,
            code
        });
        if(color){
            return res.json(color);
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
async delete(req, res, next) {
    try {
        const { id } = req.body;

        const color = await Color.findOne({ where: { id } });
        if (!color) {
            return next(ApiError.light('Цвет не выбран или отсутствует'));
        }

        // Проверка связей с заказами
        const relatedOrders = await color.getOrders();
        if (relatedOrders.length > 0) {
            return next(ApiError.light(`Невозможно удалить цвет: он используется в ${relatedOrders.length} заказах`));
        }
        

        // Удаляем связи с Item (через ColorItemConnector)
        await color.setItems([]); // удалит все связи в through-таблице

        // Теперь можно безопасно удалить цвет
        await color.destroy();

        return res.json({ message: 'Успешно удалено' });
    } catch (e) {
        next(ApiError.badRequest('Ошибка удаления: ' + e.message));
    }
}




}
module.exports=new ColorController()