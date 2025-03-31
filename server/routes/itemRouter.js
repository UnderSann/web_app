const Router = require('express')
const router = new Router()
const itemController = require('../controllers/itemController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.post('/',checkRoleMiddleware('ADMIN'),itemController.create)
router.post('/addimg',checkRoleMiddleware('ADMIN'),itemController.addImg)
router.post('/addcolor',checkRoleMiddleware('ADMIN'),itemController.addColor)

router.post('/update',checkRoleMiddleware('ADMIN'),itemController.updateItem)

router.get('/',itemController.getAll)
router.get('/:id',itemController.getOne)

router.delete('/remove',checkRoleMiddleware('ADMIN'),itemController.deleteOne)
router.delete('/delimg',checkRoleMiddleware('ADMIN'),itemController.deleteImg)
router.delete('/delcolor',checkRoleMiddleware('ADMIN'),itemController.removeColor)



module.exports =router