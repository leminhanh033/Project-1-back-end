//model
const tourmodel=require("../../models/admin/tour.model");
const categorymodel=require("../../models/admin/category.model");
const provincemodel=require("../../models/admin/province.model");

const findCategoryParent=async(categoryID)=>{
  const currentCategory=await categorymodel.findOne({
    _id:categoryID,
  })
  currentCategory.path=`/category/${currentCategory.slug}`;

  if(currentCategory.parent=="")
    return [currentCategory];

  const parentList=await findCategoryParent(currentCategory.parent);
  const listCategory=[...parentList,currentCategory];
  return listCategory;
}

module.exports.tourDetail=async(req,res)=>{
  const tourDetail=await tourmodel.findOne({
    slug:req.params.slug,
    deleted:false,
  })

  
  tourDetail.path=`/tour/detail/${tourDetail.slug}`;

  const categoryList=await findCategoryParent(tourDetail.category);
  tourDetail.categoryParent=categoryList;

  tourDetail.destinationFormat=await provincemodel.find({
    _id:{$in:tourDetail.destination},
  })

  res.render('client/pages/tourdetail.pug',{
    title:"Chi tiết tour",
    tourDetail,
  });
}