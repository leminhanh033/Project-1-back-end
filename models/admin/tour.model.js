require('dotenv').config();
const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const schema = new mongoose.Schema({ 
  name:String,
  category:String,
  position:Number,
  state:String,
  avatar:String,
  images:Array,

  oldAdult:Number,
  oldChild:Number,
  oldBaby:Number,

  newAdult:Number,
  newChild:Number,
  newBaby:Number,

  remainAdult:Number,
  remainChild:Number,
  remainBaby:Number,

  destination:Array,
  time:String,
  vehicle:String,
  departureDate:String,

  information:String,
  schedule:Array,

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

const tourmodel=mongoose.model('tour',schema,'tour');
module.exports=tourmodel;