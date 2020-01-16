const router = require('express').Router()
const userRouter = require('./users')
const postcardRouter = require('./postcards')
const { authentication } = require('../middlewares/auth')

router.get('/', (req, res, next) => {
  res.send('Welcome to Postcard App')
})

router.use('/users', userRouter);
router.use(authentication)
router.use('/postcards', postcardRouter);

module.exports = router