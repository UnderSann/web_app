const Router = require('express')
const router = new Router()
const BasketController = require('../controllers/basketController')

router.post('/add', BasketController.addToBasket);
router.get('/:userId', BasketController.getBasket);
router.delete('/remove', BasketController.removeFromBasket);
router.delete('/remove', BasketController.clearBasket);

module.exports =router