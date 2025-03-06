const Router = require('express')
const router = new Router()
const itemController = require('../controllers/itemController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.post('/',checkRoleMiddleware('ADMIN'),itemController.create)
router.get('/',itemController.getAll)
router.get('/:id',itemController.getOne)
router.post('/:id',checkRoleMiddleware('ADMIN'),itemController.deleteOne)

module.exports =router