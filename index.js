const express = require('express')
const path = require('path')
require('dotenv').config()
const app = express()
const port = 3000
const {connectDatabase}=require("./configs/database.config.js");

connectDatabase();


app.set('views', path.join(__dirname,'views'))
app.set('view engine', 'pug')

// file tĩnh
app.use(express.static(path.join(__dirname,'public')))

//router
const router=require("./router/client/index.router.js");
app.use('/', router);

app.listen(port, () => {
  console.log(`welcome to ${port}`)
})

