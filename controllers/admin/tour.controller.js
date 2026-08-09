const provincemodel = require("../../models/admin/province.model")
const tourmodel = require("../../models/admin/tour.model")
const accountmodel = require("../../models/admin/account.model")
const categorymodel = require("../../models/admin/category.model")
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
  if (req.query.category) {
    filter.category = req.query.category;
  }
  if (req.query.price) {
    const price = req.query.price;
    if (price.includes("+")) {
      const min = Number(price.replace("+", ""));
      filter.newAdult = {
        $gte: min,
      }
    }
    else {
      const [min, max] = price.split("-");
      filter.newAdult = {
        $gte: Number(min),
        $lte: Number(max),
      }
    }
  }
  //pagination
  const limit = 4;
  let skip = 0;
  if (req.query.page && req.query.page > 0) {
    skip = (req.query.page - 1) * limit;
  }
  const total = await tourmodel.countDocuments(filter);
  const pagination = {
    total: total,
    numberPage: Math.ceil(total / limit),
    limit: limit,
    skip: skip,
  }
  //Người tạo
  const account = await accountmodel.find({}).select("id fullname email");
  //category
  const category = await categorymodel.find({
    deleted: false,
  })
  const categoryList = categoryTree(category)
  //tour
  const tourList = await tourmodel.find(filter)
    .sort({
      position: "desc",
    })
    .limit(limit)
    .skip(skip)
  for (const item of tourList) {
    //createdByName
    if (item.createdBy) {
      const createdAccount = await accountmodel.findOne({
        _id: item.createdBy,
      })
      item.createdByName = createdAccount.fullname;
      item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY")
    }
    //updatedByName
    if (item.updatedBy) {
      const updatedAccount = await accountmodel.findOne({
        _id: item.updatedBy,
      })
      item.updatedByName = updatedAccount.fullname;
      item.updatedAtFormat = moment(item.updatedAt).format("HH:mm - DD/MM/YYYY")

    }

  }

  //render
  res.render("admin/pages/tour-manage", {
    title: "Quản lý tour",
    tourList: tourList,
    account: account,
    pagination: pagination,
    categoryList: categoryList,
  });

}

module.exports.applyPatch = async (req, res) => {
  const option = req.body.option;
  if (option == "active" || option == "inactive" || option == "pending") {
    if (req.role.listRights.includes("edit-tour")) {
      await tourmodel.updateMany({
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
    else {
      res.json({
        code: 'error',
        message: "Bạn không được cấp quyền"
      })
    }
  }
  else if (option == "delete") {
    if (req.role.listRights.includes("delete-tour")) {
      await tourmodel.updateMany({
        _id: { $in: req.body.listID },
        deleted: false,
      }, {
        state: "delete",
        deleted: true,
        deletedBy: req.account.id,
        deletedAt: Date.now(),
      })
      res.json({
        code: "success",
        message: "Cập nhật thành công"
      })
    }
    else {
      res.json({
        code: 'error',
        message: "Bạn không được cấp quyền"
      })
    }
  }
  else {
    res.json({
      code: "error",
      message: "Hành động không hợp lệ"
    })
  }
}

module.exports.create = async (req, res) => {
  //province
  const provinces = await provincemodel.find({});
  //category
  const category = await categorymodel.find({})
  res.render("admin/pages/tour-create", {
    title: "Tạo tour",
    provinces: provinces,
    category: categoryTree(category),

  });
}

module.exports.createPost = async (req, res) => {
  try {
    //position
    if (!req.body.position) {
      const tour = await tourmodel.findOne({
        deleted: false,
      })
        .sort({
          position: "desc",
        })
      if (tour) {
        req.body.position = tour.position + 1;
      }
      else {
        req.body.position = 1;
      }
    }
    else {
      req.body.position = parseInt(req.body.position);
    }
    //createdBy
    req.body.createdBy = req.account.id;
    //avatar
    if (req.files){
      req.body.avatar = req.files["avatar"][0].path;
      req.body.images=req.files["images"].map(item=>item.path);
    }
    //destination
    if (req.body.destination)
      req.body.destination = JSON.parse(req.body.destination);
    //schedule
    if (req.body.schedule)
      req.body.schedule = JSON.parse(req.body.schedule);
    //save tour
    const newTour = new tourmodel(req.body);
    await newTour.save();
    res.json({
      code: 'success',
      message: "Tạo thư mục thành công",
    })
  }
  catch (error) {
    res.json({
      code: "error",
      message: "Tạo tour không thành công"
    })
  }
}

//Trang thùng rác
module.exports.rubbish = async (req, res) => {
  const filter = {
    deleted: true,
  }
  if (req.query.search) {
    filter.slug = (new RegExp(slugify(req.query.search), 'i'));
  }
  //pagination
  const limit = 4;
  let skip = 0;
  if (req.query.page && req.query.page > 0) {
    skip = (req.query.page - 1) * limit;
  }
  const total = await tourmodel.countDocuments(filter);
  const pagination = {
    total: total,
    numberPage: Math.ceil(total / limit),
    limit: limit,
    skip: skip,
  }
  //end pagination


  const tourList = await tourmodel.find(filter)
    .sort({
      position: "desc"
    })
    .limit(limit)
    .skip(skip)


  for (const item of tourList) {
    //createdByName
    if (item.createdBy) {
      const createdAccount = await accountmodel.findOne({
        _id: item.createdBy,
      })
      item.createdByName = createdAccount.fullname;
      item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY")
    }
    //updatedByName
    if (item.deletedBy) {
      const deletedAccount = await accountmodel.findOne({
        _id: item.deletedBy,
      })
      item.deletedByName = deletedAccount.fullname;
      item.deletedAtFormat = moment(item.deletedAt).format("HH:mm - DD/MM/YYYY")

    }

  }

  const checkPer=req.role.listRights.includes("rubbish-tour");
  
  res.render("admin/pages/tour-rubbish", {
    title: "Thùng rác tour",
    tourList: checkPer?tourList:[],
    pagination: checkPer?pagination:{}
  });
}

module.exports.rubbishRestore = async (req, res) => {
  const tour = await tourmodel.findOne({
    _id: req.body.id,
  })
  if (!tour) {
    res.json({
      code: "error",
      message: "Không tìm thấy tour"
    })
    return;
  }
  await tourmodel.updateOne({
    _id: req.body.id,
  }, {
    deleted: false,
    updatedBy: req.account.id,
    state: "active",
  })
  res.json({
    code: "success",
    message: "Khôi phục tour thành công",
  })

}

module.exports.foreverDelete = async (req, res) => {
  const tour = await tourmodel.findOne({
    _id: req.body.id,
  })
  if (!tour) {
    res.json({
      code: "error",
      message: "Không tìm thấy tour"
    })
    return;
  }
  await tourmodel.deleteOne({
    _id: req.body.id,
  })
  res.json({
    code: "success",
    message: "Đã xoá tour vĩnh viễn"
  })

}

module.exports.deletePost = async (req, res) => {
  await tourmodel.updateOne({
    _id: req.body.id,
    deleted: false,
  }, {
    state: "delete",
    deleted: true,
    deletedBy: req.account.id,
    deletedAt: Date.now(),
  })
  res.json({
    code: "success",
    message: "Xoá tour thành công"
  })
}

module.exports.rubbishApplyPatch = async (req, res) => {
  const option = req.body.option;
  if (option == "restore") {
    await tourmodel.updateMany({
      _id: { $in: req.body.listID },
      deleted: true,
    }, {
      state: "active",
      updatedBy: req.account.id,
      deleted: false,
    })
    res.json({
      code: "success",
      message: "Khôi phục thành công"
    })
  }
  else if (option == "delete") {
    await tourmodel.deleteMany({
      _id: { $in: req.body.listID },
      deleted: true,
    })
    res.json({
      code: "success",
      message: "Xoá thành công"
    })
  }
  else {
    res.json({
      code: "error",
      message: "Hành động không hợp lệ"
    })
  }
}

//Trang edit
module.exports.edit = async (req, res) => {
  try {
    //province
    const provinces = await provincemodel.find({});
    //category
    const category = await categorymodel.find({})
    //tour detail
    const tourDetail = await tourmodel.findOne({
      _id: req.params.id,
    })
    res.render(`admin/pages/tour-edit`, {
      title: "Trang chỉnh sửa tour",
      provinces: provinces,
      category: categoryTree(category),
      tourDetail: tourDetail,
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

module.exports.editPatch = async (req, res) => {
  try {
    const tour = await tourmodel.findOne({
      _id: req.params.id,
      deleted: false,
    });
    if (!tour) {
      res.json({
        code: "error",
        message: "Không tìm thấy tour đang chỉnh sửa"
      })
      return;
    }
    //position
    if (!req.body.position) {
      const tourMax = await tourmodel.findOne({
        deleted: false,
      })
        .sort({
          position: "desc",
        })
      if (tourMax) {
        console.log(tourMax)
        req.body.position = tour.position + 1;
      }
      else {
        req.body.position = 1;
      }
    }
    else {
      req.body.position = parseInt(req.body.position);
    }
    //avatar
    if (req.files){
      req.body.avatar = req.files["avatar"][0].path;
      if(req.files["images"])
        req.body.images=req.files["images"].map(item=>item.path);
    }
    //destination
    if (req.body.destination)
      req.body.destination = JSON.parse(req.body.destination);
    //schedule
    if (req.body.schedule)
      req.body.schedule = JSON.parse(req.body.schedule);
    //updatedBy
    req.body.updatedBy = req.account.id;

    await tourmodel.updateOne({
      _id: req.params.id,
      deleted: false,
    }, req.body)
    res.json({
      code: "success",
      message: "Cập nhật thành công",
    })
  }
  catch (error) {
    console.log(error);
    res.json({
      code: 'error',
      message: "Đã xảy ra lỗi"
    })
  }
}