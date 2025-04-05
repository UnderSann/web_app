const Router = require('express')
const router = new Router()

const orderController = require('../controllers/orderController')


router.post('/',orderController.create)

router.get('/',orderController.fetchAll)
router.get('/:userId',orderController.fetchAllUsers)

router.delete('/delete/:id',orderController.delete)

router.post('/update',orderController.update)

module.exports =router