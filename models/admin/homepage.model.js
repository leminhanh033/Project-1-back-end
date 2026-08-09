require('dotenv').config();
const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const schema = new mongoose.Schema({ 
  category1:String,
  category2:String
}, { timestamps: true });

const homepagemodel=mongoose.model('Home Page',schema,'homepage');
module.exports=homepagemodel;