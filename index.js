const express = require('express')
const path = require('path')
require('dotenv').config()
const app = express()
const port = 3000
const mongoose = require('mongoose');

// console.log(process.env.DATABASE_LINK)

mongoose.connect(process.env.DATABASE_LINK);

//model
const Tour = mongoose.model('Tour', { 
  name: String,
  vehicle:String,
  numberOfDay:Number
},'page');

app.set('views', path.join(__dirname,'views'))
app.set('view engine', 'pug')

// file tĩnh
app.use(express.static(path.join(__dirname,'public')))

app.get('/', async(req, res) => {

  const data=await Tour.find({});
  console.log(data);
  res.render('index',{name:"Trang chủ"});

})

app.listen(port, () => {
  console.log(`welcome to ${port}`)
})

// anhle
// 5HfiXNP4JUuJJfXy