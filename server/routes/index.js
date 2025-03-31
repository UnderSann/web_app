const Router = require('express')
const router = new Router()
const itemRouter = require('./itemRouter')
const typeRouter = require('./typeRouter')
const userRouter = require('./userRouter')
const basketRouter = require('./basketRouter'); 
const orderRouter = require('../routes/orderRouter')
const colorRouter = require('../routes/colorRouter')

router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/item', itemRouter)
router.use('/basket', basketRouter);
router.use('/order', orderRouter);
router.use('/color', colorRouter);
module.exports =router