const router = require('express').Router()
const PostcardController = require('../controllers/postcardController')
const { multer, sendUploadToGCS } = require("../middlewares/gcs");
const { authorization } = require('../middlewares/auth')

router.post('/', 
  multer.single("image"),
  sendUploadToGCS,
  PostcardController.create
)
router.get('/', PostcardController.findAll)
router.get('/all/own', PostcardController.findMine)
// like

router.use('/:id', authorization)
router.get('/:id', PostcardController.findOne)
// router.put('/:id', PostcardController.edit)
router.delete('/:id', PostcardController.destroy)

module.exports = router;