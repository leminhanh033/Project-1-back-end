var jwt = require('jsonwebtoken');
const accountmodel=require('../../models/admin/account.model');

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
    }
  next();
  } catch(err) {
    res.redirect(`/${pathAdmin}/account/login`)
    return;  
  }
}