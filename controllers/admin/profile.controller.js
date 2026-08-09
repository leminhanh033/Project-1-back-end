const rolemodel=require("../../models/admin/role.model");
const accountmodel=require("../../models/admin/account.model");

const bcrypt=require("bcryptjs");


module.exports.edit=async(req,res)=>{
  const account=req.account;
  const role=await rolemodel.findOne({
    _id:account.role,
  });
  account.roleFormat=role.name;

  const listRole=await rolemodel.find({});
  
  res.render("admin/pages/profile-edit",{
    title:"Thông tin cá nhân",
    account:account,
    listRole,
  })
}

module.exports.editPatch=async(req,res)=>{
  try{
    const account=await accountmodel.findOne({
      _id:{$ne:req.account.id},
      email:req.body.email,
    })
    if(account){
      res.json({
        code:"error",
        message:"Email đã tồn tại"
      })
      return;
    }
    if(req.file){
      req.body.avatar=req.file.path;
    }
    
    //update
    await accountmodel.updateOne({
      _id:req.account.id,
      deleted:false,
    },req.body)
    res.json({
      code:"success",
      message:"Cập nhật thông tin tài khoản thành công",
    })
  }
  catch(error){
    console.log(error);
    res.json({
      code:"error",
      message:"Đã xảy ra lỗi"
    })
  }
}

module.exports.changePassword=async(req,res)=>{
  res.render("admin/pages/profile-change-password",{
    title:"Đổi mật khẩu"
  })
}

module.exports.changePasswordPatch=async(req,res)=>{
  try{
    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(req.body.password, salt);
    
    await accountmodel.updateOne({
      _id:req.account.id,
    },{
      password:password,
    })
    res.json({
      code:"success",
      message:"Cập nhật tài khoản mới thành công",
    })
  }
  catch(error){
    console.log(error);
    res.json({
      code:"error",
      message:"Đã xảy ra lỗi",
    })
  }
}