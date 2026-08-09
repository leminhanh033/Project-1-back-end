const websiteInformodel = require("../../models/admin/websiteInfor.model")
const tourmodel = require("../../models/admin/tour.model")
const categorymodel = require("../../models/admin/category.model")
const homepagemodel = require("../../models/admin/homepage.model");

const { categoryTree } = require("../../helpers/categoryTree.helper");

const {tourFromCategory} = require("../../helpers/tourFromCategory.helper")

module.exports.headerFooter = async (req, res, next) => {
  res.locals.websiteInfor = await websiteInformodel.findOne({});
  const allCategory = await categorymodel.find({
    deleted: false,
  })
  const listCategory = categoryTree(allCategory);

  let list = []
  for(const item of listCategory){
    const tour = await tourFromCategory(item);
    // console.log(tour);
    list.push({
      id: item.id,
      name: item.name,
      slug: item.slug,
      tour: tour,
    })
  }
  res.locals.categoryTour = list;
  next();
}