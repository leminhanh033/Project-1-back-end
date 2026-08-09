require('dotenv').config();
const mongoose = require('mongoose');

const schema = new mongoose.Schema({ 
  name:String,  
}, { timestamps: true });

const provincemodel=mongoose.model('province',schema,'provinces');
module.exports=provincemodel;