const categoryTree=(listCategory,parent="")=>{
  const children=[]
  listCategory.forEach(element => {
    if(element.parent==parent){
      const item={
        id:element.id,
        name:element.name,
        slug:element.slug,
        children:categoryTree(listCategory,element.id),
      }
      children.push(item);
    }
  });
  return children;
}

module.exports.categoryTree=categoryTree;