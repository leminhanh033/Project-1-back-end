module.exports.manage=async(req, res)=>{
  res.render("admin/pages/category-manage",{title:"Quản lý danh mục"});
}
module.exports.create=async(req, res)=>{
  res.render("admin/pages/category-create",{title:"Tạo danh mục"});
}