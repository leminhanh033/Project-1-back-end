var jwt = require('jsonwebtoken');
const accountmodel=require('../../models/admin/account.model');
const rolemodel=require('../../models/admin/role.model')

module.exports.checkLogin=async(req,res,next)=>{
  const token =req.cookies.loginID;
  if(!req.cookies.loginID){
    res.redirect(`/${pathAdmin}/account/login`);
    return;
  }
  try {
    var decoded = jwt.verify(token, process.env.COOKIE_ACCOUNT);
    const account=await accountmodel.findOne({
      _id:decoded.id,
      email:decoded.email,
    })
    if(!account){
      res.clearCookie("loginID");
      res.redirect(`/${pathAdmin}/account/login`)
      return;
    }
    
    req.account=account;

    const roleFormat=await rolemodel.findOne({
      _id:account.role,
    });
    res.locals.accountLogin={
      id:account.id,
      fullname:account.fullname,
      email:account.email,
      roleFormat:roleFormat ? roleFormat.name : "",
      avatar:account.avatar,
      listRights:roleFormat?roleFormat.listRights:[],
    }

    req.role=roleFormat;

    next();
  } catch(err) {
    res.redirect(`/${pathAdmin}/account/login`)
    return;  
  }
}