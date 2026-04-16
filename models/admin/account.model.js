require('dotenv').config();
const mongoose = require('mongoose');

const schema = new mongoose.Schema({ 
  fullname:String,
  email:String,
  password:String,
  status:String,
}, { timestamps: true });

const accountmodel=mongoose.model('Account',schema,'account-admin');
module.exports=accountmodel;