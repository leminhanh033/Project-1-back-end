const tourmodel = require("../models/admin/tour.model")


const tourFromCategoryHelper = (category, listTour) => {
  const children = []
  let tourElement = []

  if(listTour){
    listTour.forEach(tour => {
    if (tour.category == category.id) {
      tourElement.push(tour);
    }
  })
  }
  if(category.children){
    category.children.forEach(item=>{
      const childrenTour = tourFromCategoryHelper(item, listTour);
      tourElement = [...tourElement, ...childrenTour]
    })
  }
  
  return tourElement;
}

const tourFromCategory=async(category)=>{
  const listTour = await tourmodel.find({
    deleted: false,
  })
  return tourFromCategoryHelper(category, listTour);
}

module.exports = {
  tourFromCategory,
  tourFromCategoryHelper,
};