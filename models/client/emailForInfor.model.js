require('dotenv').config();
const mongoose = require('mongoose');

const schema = new mongoose.Schema({ 
  email:String,
  deleted:{
    type:Boolean,
    default:false,
  }
}, { timestamps: true });

const emailForInformodel=mongoose.model('emailForInfor',schema,'emailForInfor');
module.exports=emailForInformodel;