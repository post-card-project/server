'use strict'

const bcrypt = require('bcryptjs')

module.exports = {
  hashPass(password) {
    return bcrypt.hashSync(password, 8);
  },

  validatePass(password, hash) {
    return bcrypt.compareSync(password, hash)
  }
}