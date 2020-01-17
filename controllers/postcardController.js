const Postcard = require('../models/postcard');

module.exports = class PostcardController {
  static create(req, res, next) {
     Postcard.create({
        image: req.body.image,
        editedImage: req.body.editedImage,
        name: req.body.name,
        address: req.body.address,
        message: req.body.message,
        sender: req.body.sender,
        location: req.body.location,      
     })
     .then(postcard => {
       res.status(201).json(postcard)
     })
     .catch(next)
  }
  
  static findAll(req, res, next) {
     Postcard.find()
     .then(postcards => {
        res.status(200).json(postcards);
     })
     .catch(next)
  }

  static findOne(req, res, next) {
     Postcard.findOne({
        _id: req.params.id
     })
     .then(postcard => {
        res.status(200).json(postcard)
     })
     .catch(next)
  }
}