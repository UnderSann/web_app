const Router = require('express')
const router = new Router()
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const orderController = require('../controllers/orderController')


router.post('/',orderController.create)

router.get('/', checkRoleMiddleware('ADMIN'),orderController.fetchAll)
router.get('/:userId',orderController.fetchAllUsers)

router.delete('/delete/:id',orderController.delete)

router.post('/update',orderController.update)
router.post('/comfirmed', checkRoleMiddleware('ADMIN'),orderController.inWork)
router.post('/done', checkRoleMiddleware('ADMIN'),orderController.isDone)

module.exports =router