require('dotenv').config();
const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const schema = new mongoose.Schema({ 
  code:String,
  fullname:String,
  phone:String,
  note:String,
  items:Array,

  subtotal:Number,
  total:Number,
  paymentMethod:String,
  paymentStatus:String,

  status:String,
  updatedBy:String,
  deleted:{
    type:Boolean,
    default:false,
  },
  deletedAt:Date,
  deletedBy:String,

}, { timestamps: true });

const ordermodel=mongoose.model('Order',schema,'order');
module.exports=ordermodel;