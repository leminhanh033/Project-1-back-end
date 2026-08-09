const categorymodel = require('../../models/admin/category.model');
const accountmodel = require('../../models/admin/account.model')
const cloudinary = require('cloudinary').v2;
const { categoryTree } = require('../../helpers/categoryTree.helper');
const moment = require('moment');
const slugify = require('slugify');



module.exports.manage = async (req, res) => {
  const filter = {
    deleted: false,
  }
  if (req.query.state) {
    filter.state = req.query.state;
  }
  if (req.query.createPerson) {
    filter.createdBy = req.query.createPerson;
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
  if (req.query.search) {
    filter.slug = (new RegExp(slugify(req.query.search), 'i'));
  }
  //Xử lý cho page
  const limit = 4;
  let skip = 0;
  if (req.query.page && req.query.page > 0) {
    skip = (req.query.page - 1) * limit;
  }
  const total = await categorymodel.countDocuments(filter);
  const pagination = {
    total: total,
    numberPage: Math.ceil(total / limit),
    limit: limit,
    skip: skip,
  }

  const categoryList = await categorymodel.find(filter)
    .sort({
      position: "desc",
    })
    .limit(limit)
    .skip(skip)
  for (const item of categoryList) {
    item.createdAtFormat = (moment(item.createdAt).format("HH:mm - DD/MM/YYYY"));
    item.updatedAtFormat = (moment(item.updatedAt).format("HH:mm - DD/MM/YYYY"));
    const accountCreate = await accountmodel.findOne({
      _id: item.createdBy,
    })
    item.createdByName = accountCreate.fullname;
    if (item.updatedBy) {
      const accountUpdate = await accountmodel.findOne({
        _id: item.updatedBy,
      })
      item.updatedByName = accountUpdate.fullname;
    }
  };

  const accountList = await accountmodel.find({}).select("_id fullname email");
  res.render("admin/pages/category-manage", {
    title: "Quản lý danh mục",
    categoryList: categoryList,
    accountList: accountList,
    pagination: pagination,
  });
}

module.exports.create = async (req, res) => {
  const filter = {
    deleted: false,
  }
  const listCategory = await categorymodel.find(filter)
  res.render("admin/pages/category-create", {
    title: "Tạo danh mục",
    listCategory: categoryTree(listCategory),
  });
}

module.exports.createPost = async (req, res) => {
  //position
  if (req.body.position)
    req.body.position = parseInt(req.body.position);
  else {
    const positionMax = await categorymodel.findOne({})
      .sort({
        position: "desc",
      })
    if (!positionMax) {
      req.body.position = 1
    }
    else {
      req.body.position = positionMax.position + 1;
    }
  }
  //createdBy
  req.body.createdBy = req.account.id;
  //avatar
  if (req.file)
    req.body.avatar = req.file.path;
  //create new
  const newCategory = new categorymodel(req.body);
  await newCategory.save();
  res.json({
    code: "success",
    message: "Tạo danh mục thành công"
  })
}

module.exports.edit = async (req, res) => {
  //find category
  const category = await categorymodel.findOne({
    _id: req.params.id,
  })
  const listCategory = await categorymodel.find({
    deleted: false,
  })
  res.render("admin/pages/category-edit", {
    title: "Chỉnh sửa danh mục",
    category: category,
    listCategory: categoryTree(listCategory),
  });

}


module.exports.editPatch = async (req, res) => {
  try {
    //position
    if (req.body.position)
      req.body.position = parseInt(req.body.position);
    else {
      const positionMax = await categorymodel.findOne({})
        .sort({
          position: "desc",
        })
      if (!positionMax) {
        req.body.position = 1
      }
      else {
        req.body.position = positionMax.position + 1;
      }
    }
    //updatedBy
    req.body.updatedBy = req.account.id;
    //avatar
    if (req.file) {
      req.body.avatar = req.file.path;
    }
    //update
    await categorymodel.updateOne({
      _id: req.params.id,
    }, req.body);
    res.json({
      code: "success",
      message: "Chỉnh sửa danh mục thành công"
    })
  }
  catch (error) {
    res.json({
      code: "error",
      message: "Đã xảy ra lỗi"
    })
  }
}

module.exports.deletePost = async (req, res) => {
  try {
    if (req.role.listRights.includes("delete-category")) {
      await categorymodel.updateOne({
        _id: req.body.id
      }, {
        deleted: true,
        deletedBy: req.account.id,
        deletedAt: Date.now(),
      })
      res.json({
        code: "success",
        message: "Xoá thư mục thành công",
      })
    }
    else{
      res.json({
        code:"error",
        message:"Bạn không được cấp quyền"
      })
      return;
    }
  }
  catch(error){
    console.log(error);
    res.json({
      code:"error",
      message:"Đã xảy ra lỗi"
    })
  }
}

module.exports.applyPatch = async (req, res) => {
  const option = req.body.option;
  if (option == "active" || option == "inactive" || option == "pending") {
    if(req.role.listRights.includes("edit-category")){
      await categorymodel.updateMany({
        _id: { $in: req.body.listID },
        deleted: false,
      }, {
        state: option,
        updatedBy: req.account.id,
      })
      res.json({
        code: "success",
        message: "Cập nhật thành công"
      })
    }
    else{
      res.json({
        code:"error",
        message:"Bạn không được cấp quyền"
      })
      return;
    }
  }
  else if (option == "delete") {
    if (req.role.listRights.includes("delete-category")) {
      await categorymodel.updateMany({
        _id: { $in: req.body.listID },
        deleted: false,
      }, {
        deleted: true,
        deletedBy: req.account.id,
        deletedAt: Date.now(),
      })
      res.json({
        code: "success",
        message: "Cập nhật thành công"
      })
    }
    else{
      res.json({
        code:"error",
        message:"Bạn không được cấp quyền"
      })
      return;
    }
  }
  else {
    res.json({
      code: "error",
      message: "Hành động không hợp lệ"
    })
  }

}

