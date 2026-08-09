require('dotenv').config();
const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const schema = new mongoose.Schema({ 
  fullname:String,
  email:String,
  phone:String,
  role:String,
  roleName:String,
  password:String,
  status:String,
  avatar:String,

  slug:{ type: String, slug: "fullname", unique: true },
  

  createdBy:String,
  updatedBy:String,
  deleted:{
    type:Boolean,
    default:false,
  },
  deletedBy:String,
  deletedAt:Date,
}, { timestamps: true });

const accountmodel=mongoose.model('Account',schema,'account-admin');
module.exports=accountmodel;