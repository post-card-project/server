'use strict'

const User = require('../models/user')
const Postcard = require('../models/postcard')
const { verifyToken } = require('../helpers/jwt')

module.exports = {
  authentication(req, res, next) {
    if (req.headers.hasOwnProperty('access_token')) {
      try {
        req.decoded = verifyToken(req.headers.access_token)
        User.findById(req.decoded.id)
          .then(user => {
            if (user) {
              next()
            } else {
              next({ status: 400, message: 'Invalid access' })
            }
          })
          .catch(next)
      } catch(err) {
        next(err)
      }
    } else {
      next({ status: 401, message: 'You must log in first'})
    }
  },

  authorization(req, res, next) {
    Postcard.findById(req.params.id)
      .then(postcard => {
        if (postcard) {
          if (String(postcard.user) === req.decoded.id) {
            next()
          } else {
            next({ status: 403, message: 'Unauthorized process!' })
          }
        } else {
          next({ status: 404, message: 'Postcard not found!' })
        }
      })
      .catch(next)
  }
}