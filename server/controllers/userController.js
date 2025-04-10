const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Basket, BasketItem} = require('../models/models')

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id,email,role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController{
    async registration(req,res,next){
        const {email, password, role} = req.body
        if(!email || !password){
            return next(ApiError.light('Неверный пароль или адресс электронной почты'))
        }
        const candidate = await User.findOne({where:{email}})
        if(candidate){
           return next(ApiError.light('Данный почтовый адресс уже зарегистрирован'))
        }
        const hashPassword = await bcrypt.hash(password,5)
        const user = await User.create({email,role,password:hashPassword})
        const basket = await Basket.create({userId: user.id})
        const token = generateJwt(user.id,user.email,user.role)
        return res.json({token})
    }

    async login(req,res,next){
        const {email, password} = req.body
        const user = await User.findOne({where:{email}})
        if(!user){
            return next(ApiError.light('Пользователь с данным именем не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)  
        if(!comparePassword){
            return next(ApiError.light('Неверный пароль'))
        }
        const token = generateJwt(user.id,user.email,user.role)
        return res.json({token})
    }

    async check(req,res){
        const token = generateJwt(req.user.id,req.user.email,req.user.role)
        return res.json({token})
    }

    async deleteUser(req,res,next){
        const {userId} = req.body
        const user =await User.findOne({where:{id:userId}})
        const basket=await Basket.findOne({where:{userId}})
        if(!user){
            return next(ApiError.light('Данного пользователя не существует: '+userId))
        }
        try{
            await BasketItem.destroy({ where: { basketId: basket.id } });
            if (basket) {
                await basket.destroy();
            }
            await user.destroy();
        }catch(e){
            return next(ApiError.light('Ошибка удаления '))
        }
        return res.json({message:"Пользователь "+ userId + " удален"})
    }
}
module.exports=new UserController()