module.exports.manage=async(req, res)=>{
  res.render("admin/pages/tour-manage",{title:"Quản lý tour"});
}

module.exports.create=async(req, res)=>{
  res.render("admin/pages/tour-create",{title:"Tạo tour"});
}

module.exports.rubbish=async(req, res)=>{
  res.render("admin/pages/tour-rubbish",{title:"Thùng rác tour"});
}