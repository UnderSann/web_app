const Router = require('express')
const router = new Router()

const orderController = require('../controllers/orderController')


router.post('/',orderController.create)

router.get('/',orderController.fetchAll)
router.get('/:userId',orderController.fetchAllUsers)

router.delete('/delete/:id',orderController.delete)

router.post('/update',orderController.update)
router.post('/comfirmed',orderController.inWork)
router.post('/done',orderController.isDone)

module.exports =router