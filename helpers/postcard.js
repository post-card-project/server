'use strict'

const request = require('request')

function createFront(data) {

}

function createBack(ObjValue) {
  const { message, name, sender, address } = ObjValue

  const data = {
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
  }

  request.post({ url: 'https://hcti.io/v1/image', form: data })
    .auth('562cd981-cdba-4ceb-8d55-f673608de167', '54916a28-5d60-48d3-bd4f-06571c28154e')
    .on('data', function (data) {
      console.log(JSON.parse(data))
    })
}

module.exports = { createFront, createBack }
