require('dotenv').config();
const mongoose = require('mongoose');

module.exports.Tour = mongoose.model('Tour', { 
  name: String,
  vehicle:String,
  numberOfDay:Number
},'page');

