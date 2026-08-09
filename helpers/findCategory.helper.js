const categorymodel = require("../models/admin/category.model")

const { categoryTree } = require("../helpers/categoryTree.helper");

const findCategoryHelper=(categoryID,listCategory)=>{
  for(const item of listCategory){
    if(categoryID==item.id){
      return item;
    }
    else{
      const result=findCategoryHelper(categoryID,item.children);
      if(result!==null){
        return result;
      }
    }
  }

  return null;

}

const findCategory=async(categoryID)=>{
  const allCategory = await categorymodel.find({
    deleted: false,
  })
  const listCategory = categoryTree(allCategory);
  return findCategoryHelper(categoryID, listCategory)
}

module.exports=findCategory;