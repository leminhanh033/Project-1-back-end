module.exports.manage=async(req,res)=>{
  res.render("admin/pages/user-manage",{title:"Quản lý người dùng"});
}

module.exports.connect=async(req,res)=>{
  res.render("admin/pages/user-information-connect",{title:"Thông tin liên hệ"});
}