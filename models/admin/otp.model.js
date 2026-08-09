const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  email:String,
  otp:String,
  expireAt:{
    type:Date,
    expires:0,
  }
});

const otp = mongoose.model('otp', schema);
module.exports=otp;

