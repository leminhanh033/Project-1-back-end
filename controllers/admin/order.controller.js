const tourmodel = require("../../models/admin/tour.model");
const ordermodel = require("../../models/admin/order.model");
const provincemodel = require("../../models/admin/province.model");
const moment = require("moment");


module.exports.manage=async(req, res)=>{
  //filter
  const filter={
    deleted:"false",
  }
  if(req.query.status){
    filter.status=req.query.status;
  }
  if(req.query.fromDate){
    filter.createdAt={$gte:req.query.fromDate};
  }
  if(req.query.toDate){
    filter.createdAt={
      ...filter.createdAt,
      $lte:req.query.toDate,
    };
  }
  if(req.query.paymentMethod){
    filter.paymentMethod=req.query.paymentMethod;
  }
  if(req.query.paymentStatus){
    filter.paymentStatus=req.query.paymentStatus;
  }
  if(req.query.search){
    filter.code=new RegExp(req.query.search, 'i');    
  }
  //pagination
  const limit=4;
  let skip=0;
  const total=await ordermodel.countDocuments(filter);
  if(req.query.page&&req.query.page>0){
    skip=(req.query.page-1)*limit;
  }
  const pagination={
    total:total,
    limit:limit,
    skip:skip,
    numberPage:Math.ceil(total/limit),
  }  
  const orderList=await ordermodel.find(filter).limit(limit).skip(skip);
  //format
  for(const order of orderList){
    switch(order.paymentMethod){
      case "money": order.paymentMethodFormat="Thanh toán tiền mặt";break;
      case "momo": order.paymentMethodFormat="Ví momo";break;
      case "zalopay": order.paymentMethodFormat="Sử dụng Zalopay";break;
      case "vnpay": order.paymentMethodFormat="Sử dụng Vnpay";break;
      case "bank": order.paymentMethodFormat="Chuyển khoản ngân hàng";break;
    }
    order.createdAtTime=moment(order.createdAt).format("HH:mm");
    order.createdAtDate=moment(order.createdAt).format("DD/MM/YYYY");
  }
  res.render("admin/pages/order-manage",{
    title:"Quản lý đơn hàng",
    orderList:orderList,
    pagination,
  });
}

module.exports.edit=async(req, res)=>{
  const orderDetail=await ordermodel.findOne({
    code:req.params.code,
  })
  if(!orderDetail){
    res.redirect(`/${pathAdmin}/order/manage`);
    return;
  }
  orderDetail.createdAtFormat=moment(orderDetail.createdAt).format("YYYY-MM-DDTHH:mm");
  for (const item of orderDetail.items){
    item.departureDateFormat=moment(item.departureDate).format("DD/MM/YYYY");
    const des=await provincemodel.findOne({
      _id:item.locationFrom,
    })
    item.locationFromFormat=des.name;
  }
  res.render("admin/pages/order-edit",{
    title:"Chỉnh sửa đơn hàng",
    orderDetail,
  });
}

module.exports.editPost=async(req, res)=>{
  try {
    const items = req.body.items.map(item => JSON.parse(item));
    items.forEach(item=>{
      delete item.departureDateFormat;
      delete item.locationFromFormat;
    })
    const order = {
      code: req.body.code,
      fullname: req.body.fullname,
      phone: req.body.phone,
      note: req.body.note,
      items: items,

      total:parseInt(req.body.total),
      subtotal:parseInt(req.body.subtotal),
      paymentMethod: req.body.paymentMethod,
      paymentStatus: req.body.paymentStatus,

      status: req.body.status
    }
    await ordermodel.updateOne({
      code:req.body.code,
    },order);
    res.json({
      code:"success",
      message:"Cập nhật đơn hàng thành công",
    })
  }
  catch (error) {
    console.log(error);
    res.json({
      code: 'error',
      message: "Đã xảy ra lỗi",
    })
  }
}

module.exports.deletePost=async(req,res)=>{
  try{
    await ordermodel.updateOne({
      _id:req.body.id,
      deleted:false,
    },{
      deleted:true,
    })
    res.json({
      code:'success',
      message:"Xoá đơn hàng thành công",
    })
  }
  catch(error){
    console.log(error);
    res.json({
      code:'error',
      message:"Đã xảy ra lỗi",
    })
  }
}

