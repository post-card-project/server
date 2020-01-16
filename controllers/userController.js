const User = require('../models/user')

module.exports = class UserController {
  static create(req, res, next) {
    const { name, email, password } = req.body;
    User.create({
      name,
      email,
      password
    })
      .then(user => {
        let newUser = user.toObject()
        delete newUser.password
        res.status(201).json(newUser)
      })
      .catch(next)
  }

  static login(req, res, next) {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          next({ status: 400, message: 'Incorrect email/password'});
        } else if (validatePass(req.body.password, user.password)) {
          let payload = {
            id : user._id
          };
          let token = generateToken(payload);
          res.status(200).json({access_token: token, name: user.name })
        } else {
          next({ status: 400, message: 'Incorrect email/password'});
        }
      })
      .catch(next)
  }
}