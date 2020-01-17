const router = require('express').Router()
const PostcardController = require('../controllers/postcardController')
const { authorization } = require('../middlewares/auth')

router.post('/', PostcardController.create)
router.get('/', PostcardController.findAll)

// router.use('/:id', authorization)
router.get('/:id', PostcardController.findOne)
// router.put('/:id', PostcardController.edit)
// router.delete('/:id', PostcardController.destroy)

module.exports = router;