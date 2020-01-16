'use strict'

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  require('dotenv').config()
}

const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const router = require('./routes')
const morgan = require('morgan')
const errorHandler = require('./middlewares/errorHandler')
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(morgan('dev'))

mongoose.connect(process.env.MONGO_URI, {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
  .then(() => console.log('Connected to the database!'))
  .catch(err  => console.log('Error connecting to database', err))

app.use('/', router)
app.use(errorHandler)

app.listen(port, () => console.log(`App running on port ${port}`))