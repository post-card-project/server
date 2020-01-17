const Postcard = require('../models/postcard')
const { createFront, createBack } = require('../helpers/postcard')
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

module.exports = class PostcardController {
  static create(req, res, next) {
    let location;
    const { name, address, message, sender } = req.body
    const user = req.decoded.id
    const image = req.file.cloudStoragePublicUrl

    client.landmarkDetection(req.file.cloudStorageGsUri)
      .then(result => {
        location = result[0].landmarkAnnotations[0].description
        const frontCard = createFront({ location, image })
        const backCard = createBack({ name, address, message, sender })
        return Postcard.create({
          user, name, address, message, location, sender, image, frontCard, backCard
        })
      })
      .then(postcard => {
        res.status(201).json(postcard)
      })
      .catch(next)  
}
  
  static findAll(req, res, next) {
    Postcard.find()
      .populate('user', 'name, email')
      .then(postcards => {
        res.status(200).json(postcards)
      })
      .catch(next)
  }

  static findMine(req, res, next) {
    Postcard.find({
      user: req.decoded.id
    })
      .populate('user', 'name, email')
      .then(postcards => {
        res.status(200).json(postcards)
      })
      .catch(next)
  }

  static findOne(req, res, next) {
    Postcard.findById(req.params.id)
      .populate('user', 'name, email')
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