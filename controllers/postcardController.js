const Postcard = require('../models/postcard')
const { createFront, createBack } = require('../helpers/postcard')
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
const axios = require('axios')

module.exports = class PostcardController {
  static create(req, res, next) {
    const { name, address, message, sender } = req.body
    const user = req.decoded.id
    const image = req.file.cloudStoragePublicUrl
    let frontCard, backCard, location;;

    client.landmarkDetection(req.file.cloudStorageGsUri)
      .then(result => {
      location = result[0].landmarkAnnotations[0].description
      return axios({
        url: 'https://hcti.io/v1/image',
        data: {
          html: `
            <div id="card">
                <img src="${image}" alt="loading ..">
                <div class="title">
                  <h1 id="salam">postcard from ...</h1>
                </div>
                <div class="start">
                  <h1></h1>
                </div>
                <div class="centered">
                  <h1 id="title">${location}</h1>
                </div>
            </div>`,
          css: `
          #card {
            text-align: center;
            height: 325px;
            width: 600px;
            position: relative;
            border: 1px solid;
            background-color: #f7e0ba;
            overflow: hidden;
          }
          img {
            object-fit: contain;
            /* width: 100%; */
            height: 100%;
            filter:opacity(60%);
          }
          .title {
            position: absolute;
            top: 17%;
            left: 55%;
            transform: translate(-50%, -50%);
          }
          .centered {
            position: absolute;
            top: 30%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          .start {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          #title {
            font-size: 56px;
            color: rgb(54, 53, 53);
            transform: rotate(-10deg);
            -webkit-text-stroke: 0.1rem #b3a795;
            font-family: 'Zhi Mang Xing', cursive;
          }
          #salam {
            font-size: 27px;
            color: #000000;
            transform: rotate(-10deg);
            font-family: 'Patrick Hand', cursive;
          }`,
          google_fonts: "Zhi Mang Xing|Patrick Hand"
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from('562cd981-cdba-4ceb-8d55-f673608de167' + ':' + '54916a28-5d60-48d3-bd4f-06571c28154e').toString('base64')
        },
        method: 'POST'
        })
      })
      .then(response => {
        frontCard = response.data.url
        return axios({
          url: 'https://hcti.io/v1/image',
          data: {
            html: `
            <div id="card">
              <div id="inline">
                <h1>Postcard</h1>
                <div id="content">
                  <p>${message}</p>
                </div>
                <div id="from">
                  <div class="fromder">From : <br> <strong> ${sender} </strong></div>
                  <div class="sender">To : <br> <strong> ${name} </strong> <br> ${address} </div>
                </div>
              </div>
            </div>`,
            css: `
            #card {
              height: 325px;
              width: 600px;
              position: relative;
              border: 1px solid;
              padding-top: 20px;
              padding-left: 20px;
              padding-right: 22px;
              padding-bottom: 22px;
              background-color: #f7e0ba;
            }
            #inline {
              text-align: center;
              width: 100%;
              height: 100%;
              border: 2px solid black
            }
            #content {
              padding-left: 15px;
              text-align: left;
              border-left: 3px solid;
              width: 45%;
              height: 40%;
              margin-left: 50%
            }
            h1 {
              font-family: 'Tangerine', cursive;
              font-size: 60px;
              margin-block-start: 1.5rem;
              margin-block-end: 1.5rem
            }
            p {
              font-family: 'Courier New', Courier, monospace
            }
            #from {
              margin-top: 18px;
              text-align: left;
              margin-left: 5%;
              margin-right: 5%;
              display: grid;
              grid-template-columns: 50% 50%;
              grid-gap: 10px;
              padding: 10px;
            }
            .fromder {
              font-family: 'Courier New', Courier, monospace;
              font-size: 12px
            }
            .sender {
              text-align: right;
              font-family: 'Courier New', Courier, monospace;
              font-size: 12px
            }`,
            google_fonts: "Tangerine|Courier New"
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Buffer.from('562cd981-cdba-4ceb-8d55-f673608de167' + ':' + '54916a28-5d60-48d3-bd4f-06571c28154e').toString('base64')
          },
          method: 'POST'
        })
      })
      .then(response => {
        backCard = response.data.url
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