require('dotenv').config();
const mongoose = require('mongoose');

const schema = new mongoose.Schema({ 
  name:String,
  phone:String,
  email:String,
  address:String,
  favicon:String,
  avatar:String,
}, { timestamps: true });

const websiteInformodel=mongoose.model('websiteInfor',schema,'website-infor');
module.exports=websiteInformodel;