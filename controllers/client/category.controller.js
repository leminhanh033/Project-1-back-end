const categorymodel=require("../../models/admin/category.model")
const provincemodel=require("../../models/admin/province.model")

const moment = require('moment');

module.exports.category=async(req, res) => {
  //category
  const categoryDetail= await categorymodel.findOne({
    slug:req.params.slug,
  })
  categoryDetail.path=`/category/${categoryDetail.slug}`
  //end category
  
  const tourList=req.listTourofCategory;

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
    start,
  }
  //end pagination

  const province=await provincemodel.find({});
  
  res.render('client/pages/category',{
    title:"Danh sách tour",
    categoryDetail,
    tourList:tourList.slice(skip,skip+limit),
    province,
    numberTour:tourList.length,
    pagination,
  });

}

