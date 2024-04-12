//Express
const express = require('express')
const app = express()

//ENV
require('dotenv').config()

//CORS
const cors = require("cors")
app.use(cors())

//Body-parser
const bodyParser = require('body-parser')
// parse application/json
app.use(bodyParser.json())

//Cookie-parser
const cookieParser = require('cookie-parser')
app.use(cookieParser())

//PORT
const port = process.env.PORT

//DB connection
const database = require('./config/database')
database.connect()

//Route using
const routeVer1 = require('./api/version1/routes/index.route.js')
routeVer1(app)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})