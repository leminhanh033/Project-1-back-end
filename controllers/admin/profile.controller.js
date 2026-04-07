module.exports.edit=async(req,res)=>{
  res.render("admin/pages/profile-edit",{
    title:"Thông tin cá nhân"
  })
}

module.exports.changePassword=async(req,res)=>{
  res.render("admin/pages/profile-change-password",{
    title:"Đổi mật khẩu"
  })
}
