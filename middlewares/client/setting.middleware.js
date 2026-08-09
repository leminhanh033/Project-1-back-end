const websiteInformodel = require("../../models/admin/websiteInfor.model")
const tourmodel = require("../../models/admin/tour.model")
const categorymodel = require("../../models/admin/category.model")
const homepagemodel = require("../../models/admin/homepage.model");

const { categoryTree } = require("../../helpers/categoryTree.helper");

const moment = require('moment');

const {tourFromCategory} = require("../../helpers/tourFromCategory.helper")

const findCategory = require("../../helpers/findCategory.helper");


const formatTourBlock = (tourList) => {
  tourList.forEach(item => {
    if (item.departureDate)
      item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
    item.discount = Math.ceil((item.oldAdult - item.newAdult) / item.oldAdult * 100);
    item.tourCode = item._id.toString().slice(-6);
  })
  return tourList
}

module.exports.setting = async (req, res, next) => {
  res.locals.websiteInfor = await websiteInformodel.findOne({});
  //Tìm tour từ category
   
  //Thông tin trang chủ
  const homepageInfor = await homepagemodel.findOne({});

  //Section 2
  const tourSection2 = await tourmodel.find({
    deleted: false,
  })
    .sort({
      position:"desc",
    })
    .limit(6)
  formatTourBlock(tourSection2);


  //Section 4
  const categorySection4 = await findCategory(homepageInfor.category1)
  const tourSection4 = categorySection4 ? await tourFromCategory(categorySection4) : [];
  //Section 6
  const categorySection6 = await findCategory(homepageInfor.category2)
  const tourSection6 = categorySection6 ? await tourFromCategory(categorySection6) : [];

  res.locals.tourInfor = {
    tourSection2: tourSection2,
    tourSection4: tourSection4,
    categorySection4: categorySection4,
    tourSection6: tourSection6,
    categorySection6: categorySection6,

  }

  next();
}

  //Trang danh sách tour 

module.exports.settingListTour = async (req, res, next) => {
  res.locals.websiteInfor = await websiteInformodel.findOne({});
  //Tìm tour từ category
  
  if (req.params.slug) {
    const categoryDetail = await categorymodel.findOne({
      slug: req.params.slug,
    })
    if (categoryDetail) {
      const category=await findCategory(categoryDetail._id);
      const listTourofCategory = await tourFromCategory(category);     
      req.listTourofCategory = listTourofCategory
    }
  }

  next();
}