const tourmodel = require("../../models/admin/tour.model");
const ordermodel = require("../../models/admin/order.model");
const provincemodel = require("../../models/admin/province.model");
const moment = require("moment");

module.exports.overview=async(req, res)=>{
  const orderList=await ordermodel.find({
    deleted:false,
  })
  .limit(10);
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
  //Tổng doanh thu
  const orderTotalList=await ordermodel.find({
    deleted:false,
    status:"active",
    paymentStatus:"paid",
  })
  const total=orderTotalList.reduce((total,item)=>total+item.total,0);
  //Tổng quan 
  const overview={
    numberOrder:await ordermodel.countDocuments({deleted:false,}),
    revenueTotal:total,
  }  
  res.render("admin/pages/overview",{
    title:"Trang tổng quan",
    orderList,
    overview,
  });
}

module.exports.drawChart=async(req,res)=>{
  try{
    //Dữ liệu tháng này
    const currentDate=new Date(req.body.date);
    const currentMonth=currentDate.getMonth();
    const currentYear=currentDate.getFullYear();
    const orderCurrent=await ordermodel.find({
      deleted:false,
      status:"active",
      createdAt:{
        $gte:new Date(currentYear,currentMonth,1),
        $lte:new Date(currentYear,currentMonth+1,0),
      },
      paymentStatus:"paid",
    })
    //Dữ liệu tháng trước
    const orderLast=await ordermodel.find({
      deleted:false,
      status:"active",
      createdAt:{
        $gte:new Date(currentYear,currentMonth-1,1),
        $lte:new Date(currentYear,currentMonth,0),
      },
      paymentStatus:"paid",
    })
    //Lấy số ngày
    const numberDateCurrentMonth=(new Date(currentYear,currentMonth+1,0)).getDate();
    const numberDateLastMonth=(new Date(currentYear,currentMonth,0)).getDate();
    const numberDate=numberDateCurrentMonth>numberDateLastMonth?numberDateCurrentMonth:numberDateLastMonth;
    //Lấy doanh thu
    let revenueCurrent={};
    let revenueLast={};
    for(let i=1;i<=numberDate;i++){
      revenueCurrent[i]=0;
      revenueLast[i]=0;
    }
    orderCurrent.forEach(item=>{
      const date=(new Date(item.createdAt)).getDate();
      revenueCurrent[date]+=item.total;
    })
    orderLast.forEach(item=>{
      const date=(new Date(item.createdAt)).getDate();
      revenueLast[date]+=item.total;
    })
    res.json({
      code:"success",
      message:"Vẽ biểu đồ thành công",
      revenueLast,
      revenueCurrent,
    })
  }
  catch(error){
    console.log(error);
    res.json({
      code:"error",
      message:"Vẽ biểu đồ không thành công"
    })
  }
}