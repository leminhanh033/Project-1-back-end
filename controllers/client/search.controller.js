const tourmodel = require("../../models/admin/tour.model")
const categorymodel = require("../../models/admin/category.model")
const provincemodel = require("../../models/admin/province.model")

const {tourFromCategoryHelper} = require("../../helpers/tourFromCategory.helper")
const findCategory=require("../../helpers/findCategory.helper");

const slugify = require('slugify');
const moment = require('moment');

module.exports.searchResult=async(req,res)=>{
  //filter
  const filter={
    deleted:false,
  }
  const filterResult={}
  if(req.query.fromDestination){
    filter.destination=req.query.fromDestination;
    filterResult.fromDestination=req.query.fromDestination;
  }
  if(req.query.toDestination){
    filter.name=new RegExp(slugify(req.query.toDestination),"i");
    filterResult.toDestination=req.query.toDestination;
  }
  if(req.query.departureDate){
    filter.departureDate=req.query.departureDate;
    filterResult.departureDate=req.query.departureDate;
  }
  if(req.query.adult){
    filter.remainAdult={$gte:req.query.adult};
    filterResult.adult=req.query.adult;
  }
  if(req.query.children){
    filter.remainChild={$gte:req.query.children};
    filterResult.children=req.query.chilren;
  }
  if(req.query.baby){
    filter.remainBaby={$gte:req.query.baby};
    filterResult.baby=req.query.baby;
  }
  if(req.query.price){
    filterResult.price=req.query.price;
    if(req.query.price.includes("-")){
      const [min,max]=req.query.price.split("-").map(item=>parseInt(item));
      filter.newAdult={
        $gte:min,
        $lte:max
      }
    }
    else{
      const min=parseInt(req.query.price);
      filter.newAdult={$gte:min,}
    }
  }
  if(req.query.quantity){
    req.query.quantity.split(" ").forEach(item=>{
      const [type,number]=item.split(":");
      if(type=="NL"){
        filter.remainAdult={$gte:parseInt(number)}
      }
      if(type=="TE"){
        filter.remainChild={$gte:parseInt(number)}
      }
      if(type=="EB"){
        filter.remainBaby={$gte:parseInt(number)}
      }
    })
  }
  
  //end filter

  const province=await provincemodel.find({});

  let tourList=await tourmodel.find(filter);
  const numberTour=tourList.length;

  let categoryDetail={}

  if(req.query.category){
    const categorytmp=await findCategory(req.query.category);
    tourList=await tourFromCategoryHelper(categorytmp,tourList);

    categoryDetail=await categorymodel.findOne({
      _id:req.query.category,
    })
    categoryDetail.path=`/category/${categoryDetail.slug}`
  }

  tourList.forEach(item=>{
    if(item.departureDate){
      item.departureDateFormat=moment(item.departureDate).format("DD/MM/YYYY");
    }
  })

  //pagination
  const limit=3;
  let skip=0;
  let currentPage=1;

  const numberPage=Math.ceil(tourList.length/limit)
  
  if(req.query.page){
    skip=(req.query.page-1)*limit;
    currentPage=req.query.page
  }
  const start=(Math.ceil(currentPage/4)-1)*4+1;

  const pagination={
    numberPage,
    currentPage,
    start
  }
  //end pagination
  res.render('client/pages/search-result',{
    title:"Trang kết quả tìm kiếm",
    tourList:tourList.slice(skip,skip+limit),
    numberTour,
    province,
    filter:filterResult,
    pagination,
    categoryDetail
  })
}