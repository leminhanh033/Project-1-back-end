module.exports.manage=async(req, res)=>{
  res.render("admin/pages/order-manage",{title:"Quản lý đơn hàng"});
}

module.exports.edit=async(req, res)=>{
  res.render("admin/pages/order-edit",{title:"Chỉnh sửa đơn hàng"});
}