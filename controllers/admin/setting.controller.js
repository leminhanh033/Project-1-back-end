const websiteInformodel = require("../../models/admin/websiteInfor.model");
const rolemodel = require("../../models/admin/role.model");
const accountmodel = require("../../models/admin/account.model");
const categorymodel = require("../../models/admin/category.model");
const homepagemodel = require("../../models/admin/homepage.model");

const { categoryTree } = require("../../helpers/categoryTree.helper")

const jwt = require('jsonwebtoken');

const { listRights } = require("../../configs/variable.config");
const slugify = require('slugify');
const bcrypt = require("bcryptjs");

module.exports.list = async (req, res) => {
  res.render("admin/pages/setting", { title: "Cài đặt chung" });
}
module.exports.websiteInfor = async (req, res) => {
  const websiteInfor = await websiteInformodel.findOne({});
  res.render("admin/pages/setting-website-infor", {
    title: "Thông tin website",
    websiteInfor: websiteInfor,
  });
}

module.exports.websiteInforPost = async (req, res) => {
  if (req.files.avatar) {
    req.body.avatar = req.files.avatar[0].path
  }
  if (req.files.favicon) {
    req.body.favicon = req.files.favicon[0].path
  }
  await websiteInformodel.findOneAndUpdate({}, req.body, { upsert: true, })
  res.json({
    code: "success",
    message: "Cập nhật thành công",
  })
}

//Danh sách tài khoản quản trị
module.exports.accountAdminList = async (req, res) => {
  const filter = {
    // deleted:false,
  };
  //Trạng thái
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.fromDate) {
    filter.createdAt = {
      $gte: req.query.fromDate,
    }
  }
  if (req.query.toDate) {
    filter.createdAt = {
      ...filter.createdAt,
      $lte: req.query.toDate,
    }
  }
  if (req.query.role) {
    filter.role = req.query.role;
  }
  if (req.query.search) {
    filter.slug = (new RegExp(slugify(req.query.search), 'i'));
  }
  //listaccount
  const listAccount = await accountmodel.find(filter);
  //listRights
  const listRights = await rolemodel.find({})
  //role
  for (item of listAccount) {
    const role = await rolemodel.findOne({
      _id: item.role,
    })
    if (role)
      item.roleFormat = role.name;
  }
  res.render("admin/pages/setting-account-admin-list", {
    title: "Tài khoản quản trị",
    listAccount,
    listRights
  })
}

//Tạo tài khoản quản trị
module.exports.accountAdminCreate = async (req, res) => {
  const listRole = await rolemodel.find({});
  res.render("admin/pages/setting-account-admin-create", {
    title: "Tạo tài khoản quản trị",
    listRole,
  })
}

module.exports.accountAdminCreatePost = async (req, res) => {
  try {
    const account = await accountmodel.find({
      email: req.body.email,
    })
    if (account) {
      res.json({
        code: "error",
        message: "Email đã tồn tại"
      })
      return;
    }
    if (req.file) {
      req.body.avatar = req.file.path;
    }
    const salt = bcrypt.genSaltSync(10);
    req.body.password = bcrypt.hashSync(req.body.password, salt);
    const newAccount = new accountmodel(req.body);
    await newAccount.save();
    res.json({
      code: "success",
      message: "Tạo tài khoản quản trị thành công",
    })
  }
  catch (error) {
    res.json({
      code: "error",
      message: "Đã xảy ra lỗi"
    })
  }
}

//Chỉnh sửa tài khoản quản trị
module.exports.accountAdminEdit = async (req, res) => {
  const listRole = await rolemodel.find({});
  //account-admin
  const account = await accountmodel.findOne({
    _id: req.params.id,
  })
  res.render("admin/pages/setting-account-admin-edit", {
    title: "Chỉnh sửa tài khoản quản trị",
    listRole,
    account,
  })
}

module.exports.accountAdminEditPatch = async (req, res) => {
  try {
    const account = await accountmodel.findOne({
      _id: { $ne: req.params.id },
      email: req.body.email,
    })
    if (account) {
      res.json({
        code: "error",
        message: "Email đã tồn tại"
      })
      return;
    }
    if (req.file) {
      req.body.avatar = req.file.path;
    }

    if (req.body.password) {
      const salt = bcrypt.genSaltSync(10);
      req.body.password = bcrypt.hashSync(req.body.password, salt);
    }
    else {
      delete req.body.password;
    }

    //Lưu mật khẩu lại vào cookie
    if (req.body.password && req.query.id == req.account.id) {
      const token = jwt.sign({
        email: req.body.email,
        id: req.params.id,
      }, process.env.COOKIE_ACCOUNT
        , { expiresIn: "1d" });
      res.cookie("loginID", token, {
        httpOnly: true,
        sameSite: "strict",
      })
    }

    //update
    await accountmodel.updateOne({
      _id: req.params.id,
      deleted: false,
    }, req.body)
    res.json({
      code: "success",
      message: "Cập nhật tài khoản quản trị thành công",
    })
  }
  catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Đã xảy ra lỗi"
    })
  }
}

//Trang danh sách
module.exports.roleList = async (req, res) => {
  const filter = {};
  if (req.query.search) {
    filter.slug = (new RegExp(slugify(req.query.search), 'i'));
  }
  const listRights = await rolemodel.find(filter);
  res.render("admin/pages/setting-role-list", {
    title: "Nhóm quyền",
    listRights,
  })
}

module.exports.roleListPatch = async (req, res) => {
  if (req.body.option == "delete") {
    await rolemodel.deleteMany({
      _id: { $in: req.body.listID, },
      deleted: false,
    })
    res.json({
      code: "success",
      message: "Đã xoá thành công"
    })
  }
  else {
    res.json({
      code: "error",
      message: "Hành động không hợp lệ",
    })
  }
}

module.exports.deletePost = async (req, res) => {
  try {
    await rolemodel.deleteOne({
      _id: req.body.id,
      deleted: false,
    })
    res.json({
      code: "success",
      message: "Đã xoá thành công"
    })
  }
  catch (error) {
    res.json({
      code: "error",
      message: "Đã xảy ra lỗi"
    })
  }

}

module.exports.roleCreate = async (req, res) => {
  res.render("admin/pages/setting-role-create", {
    title: "Tạo nhóm quyền",
    listRights: listRights,
  })
}

module.exports.roleCreatePost = async (req, res) => {
  try {
    const newRole = new rolemodel(req.body);
    await newRole.save();
    res.json({
      code: "success",
      message: "Tạo nhóm quyền thành công",
    })
  }
  catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Đã xảy ra lỗi",
    })
  }
}

module.exports.roleEdit = async (req, res) => {
  const role = await rolemodel.findOne({
    _id: req.params.id,
  })
  res.render("admin/pages/setting-role-edit", {
    title: "Chỉnh sửa nhóm quyền",
    role: role,
    listRights: listRights,
  })
}

module.exports.roleEditPatch = async (req, res) => {
  try {
    await rolemodel.updateOne({
      _id: req.params.id,
    }, req.body)
    res.json({
      code: "success",
      message: "Cập nhật nhóm quyền thành công",
    })
  }
  catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Đã xảy ra lỗi",
    })
  }
}

module.exports.clientHomepage = async (req, res) => {
  const categoryList = await categorymodel.find({
    deleted: false,
  })
  const homepageInfor=await homepagemodel.findOne({});
  res.render(`admin/pages/setting-client-homepage`, {
    title: "Chỉnh sửa trang chủ",
    categoryList: categoryTree(categoryList),
    homepageInfor:homepageInfor,
  })
}

module.exports.clientHomepagePatch = async (req, res) => {
  try {
    await homepagemodel.findOneAndUpdate({}, {
      category1: req.body.category1,
      category2: req.body.category2,
    }, {
      upsert: true,
    })
    res.json({
      code:'success',
      message:"Cập nhật thành công"
    })
  }
  catch(error){
    res.json({
      code:'error',
      message:"Đã xảy ra lỗi",
    })
  }
  
}