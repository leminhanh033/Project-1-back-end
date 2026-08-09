require('dotenv').config();
const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const schema = new mongoose.Schema({ 
  name:String,
  description:String,
  listRights:Array,
  createdBy:String,
  updatedBy:String,
  slug:{ type: String, slug: "name", unique: true },

  deleted:{
    type:Boolean,
    default:false,
  },
  deletedBy:String,
  deletedAt:Date,
}, { timestamps: true });

const rolemodel=mongoose.model('role',schema,'role');
module.exports=rolemodel;