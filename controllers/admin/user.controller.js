const emailForInformodel=require("../../models/client/emailForInfor.model")

const moment = require('moment');
const slugify = require('slugify')

module.exports.manage=async(req,res)=>{
  res.render("admin/pages/user-manage",{title:"Quản lý người dùng"});
}

module.exports.connect=async(req,res)=>{
  //filter
  const filter={
    deleted:false,
  }
  if(req.query.fromDate){
    filter.createdAt={
      $gte:req.query.fromDate
    }
  }
  if(req.query.toDate){
    filter.createdAt={
      ...filter.createdAt,
      $lte:req.query.toDate,
    }
  }
  if(req.query.search){
    filter.email=new RegExp(slugify(req.query.search),"i")
  }
  //end filter
  //pagination
  const limit=10;
  let skip=0;
  if(req.query.page&&req.query.page>0){
    skip=(req.query.page-1)*limit
  }
  const total=await emailForInformodel.find(filter).countDocuments();
  const pagination={
    limit,
    skip,
    total,
    numberPage:Math.ceil(total/limit),
  }
  //end pagination
  const listInfor=await emailForInformodel.find(filter)
    .limit(limit)
    .skip(skip) ;
  listInfor.forEach(item=>{
    item.createdAtFormat=moment(item.createdAt).format("HH:mm - DD/MM/YYYY")
  })
 

  res.render("admin/pages/user-information-connect",{
    title:"Thông tin liên hệ",
    listInfor,
    pagination,
  });
}

module.exports.applyPatch=async(req,res)=>{
  if(req.body.option=="delete"){
    await emailForInformodel.deleteMany({
      _id:{$in:req.body.listID}
    },{
      deleted:true,
    })
    res.json({
      code:'success',
      message:"Cập nhật thành công"
    })
  }
  else{
    res.json({
      code:'error',
      message:"Yêu cầu không hợp lệ"
    })
  }
}

module.exports.delete=async(req,res)=>{
  try{
    console.log(req.body)
    await emailForInformodel.deleteOne({
      _id:req.body.id,
    },{
      deleted:true,
    })
    res.json({
      code:'success',
      message:"Cập nhật thành công"
    })
  }
  catch(error){
    res.json({
      code:'error',
      message:"Đã xảy ra lỗi"
    })
  }
}