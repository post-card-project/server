'use strict'

const jwt = require('jsonwebtoken')

module.exports = {
  generateToken (payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
  },

  verifyToken (token) {
    return jwt.verify(token, process.env.JWT_SECRET)
  }
}