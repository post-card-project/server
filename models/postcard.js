'use strict'
const mongoose = require('mongoose')

const PostcardSchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, 'Image is required'],
    minlength: [1, 'Minimum one character is required']
  },
  frontCard: {
    type: String
  },
  backCard: {
    type: String
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [1, 'Minimum one character is required']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    minlength: [1, 'Minimum one character is required']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    minlength: [1, 'Minimum one character is required']
  },
  sender: {
    type: String,
    required: [true, 'Sender is required'],
    minlength: [1, 'Minimum one character is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  location: {
    type: String
  }
},
{
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Postcard', PostcardSchema)