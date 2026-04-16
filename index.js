const express = require('express')
const path = require('path')
require('dotenv').config()
const app = express()
const port = 3000
const {connectDatabase}=require("./configs/database.config.js");
const variableconfig =require("./configs/variable.config.js");

connectDatabase();


app.set('views', path.join(__dirname,'views'))
app.set('view engine', 'pug')

// file tĩnh
app.use(express.static(path.join(__dirname,'public')))

app.use(express.json());

app.locals.pathAdmin=variableconfig.pathAdmin;

//router
const clientrouter=require("./router/client/index.router.js");
app.use('/', clientrouter);
const adminrouter=require("./router/admin/index.router.js");
app.use(`/${variableconfig.pathAdmin}`,adminrouter);

app.listen(port, () => {
  console.log(`welcome to ${port}`)
})

