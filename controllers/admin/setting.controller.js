module.exports.list=async(req, res)=>{
  res.render("admin/pages/setting",{title:"Cài đặt chung"});
}
module.exports.websiteInfor=async(req, res)=>{
  res.render("admin/pages/setting-website-infor",{title:"Thông tin website"});
}

module.exports.accountAdminList=async(req,res)=>{
  res.render("admin/pages/setting-account-admin-list",{
    title:"Tài khoản quản trị"
  })
}
module.exports.accountAdminCreate=async(req,res)=>{
  res.render("admin/pages/setting-account-admin-create",{
    title:"Tạo tài khoản quản trị"
  })
}
module.exports.roleList=async(req,res)=>{
  res.render("admin/pages/setting-role-list",{
    title:"Nhóm quyền"
  })
}
module.exports.roleCreate=async(req,res)=>{
  res.render("admin/pages/setting-role-create",{
    title:"Tạo nhóm quyền"
  })
}