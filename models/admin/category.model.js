require('dotenv').config();
const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const schema = new mongoose.Schema({ 
  name:String,
  parent:String,
  position:Number,
  state:String,
  avatar:String,
  description:String,
  slug:{ type: String, slug: "name", unique: true },
  createdBy:String,
  updatedBy:String,
  deleted:{
    type:Boolean,
    default:false,
  },
  deletedBy:String,
  deletedAt:Date,
}, { timestamps: true });

const categorymodel=mongoose.model('category',schema,'category');
module.exports=categorymodel;