module.exports.checkPermission = (roleList) => {
  return ((req, res, next) => {
    const hasPermission=roleList.some(item=>{
      return req.role.listRights.includes(item)
    })
    if(hasPermission){
      next()
    }
    else{
      res.json({
        code: 'error',
        message: "Bạn không được cấp quyền"
      })
    }
  })
}