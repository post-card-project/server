const Postcard = require('../models/postcard')
const { createFront, createBack } = require('../helpers/postcard')

module.exports = class PostcardController {
  static create(req, res, next) {
  // image: req.file.cloudStoragePublicUrl
  // name: req.body.name
  // address: req.body.address
  // sender: req.decoded.id
  // message: req.body.message
  // location: detectLandmarks(req.file.cloudStorageGsUri)
  // frontCard: helper bram
  // backCard: helper bram
  const frontCard = createFront({ location, image })
  const backCard = createBack({ name, address, message, sender })
  const { name, address, message, sender } = req.body
  const location = detectLandmarks(req.file.cloudStorageGsUri)
  const user = req.decoded.id
  const image = req.file.cloudStoragePublicUrl
  
  Postcard.create({
    user, name, address, message, location, sender, image, frontCard, backCard
  })
    .then(postcard => {
      res.status(201).json(postcard)
    })
    .catch(next)  
}
  
  static findAll(req, res, next) {
    Postcard.find()
      .then(postcards => {
        res.status(200).json(postcards)
      })
      .catch(next)
  }

  static findMine(req, res, next) {
    Postcard.find({
      sender: req.decoded.id
    })
      .then(postcards => {
        res.status(200).json(postcards)
      })
      .catch(next)
  }

  static findOne(req, res, next) {
    Postcard.findById(req.params.id)
      .then(postcard => {
        res.status(200).json(postcard)
      })
      .catch(next)
  }

  static destroy(req, res, next) {
    Postcard.findByIdAndDelete(req.params.id)
      .then(postcard => {
        res.status(200).json(postcard)
      })
      .catch(next)
  }

  // static edit(req, res, next) {
  //   const { name, address, message } = req.body
  //   Postcard.findByIdAndUpdate(
  //     req.params.id,
  //     { name, address, message },
  //     { new: true, runValidators: true, omitUndefined: true }
  //   )
  //     .then(postcard => {
  //       res.status(200).json(postcard)
  //     })
  //     .catch(next)
  // }
}