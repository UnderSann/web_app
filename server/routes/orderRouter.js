const Router = require('express')
const router = new Router()

const orderController = require('../controllers/orderController.js')


router.post('/',orderController.create)



router.delete('/delete',orderController.delete)


module.exports =router