const Router = require('express')
const router = new Router()
const itemController = require('../controllers/colorController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.post('/',checkRoleMiddleware('ADMIN'),itemController.create)
router.get('/',itemController.fetchAll)
router.delete('/',checkRoleMiddleware('ADMIN'),itemController.delete)

module.exports =router