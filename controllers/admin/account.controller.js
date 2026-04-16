const accountmodel=require("../../models/admin/account.model.js");
const bcrypt=require("bcryptjs");
const jwt = require('jsonwebtoken');

module.exports.login=async(req, res)=>{
  res.render('admin/pages/login.pug',{title:"Trang đăng nhập"})
}

module.exports.register=async(req, res)=>{
  res.render('admin/pages/register.pug',{title:"Trang đăng ký"})
}
module.exports.registerPost=async(req, res)=>{
  const {fullname,email,password,status}=req.body;
  const findEmail=await accountmodel.findOne({
    email:email,
  });
  if(findEmail){
    res.json({
      code:"error",
      message:"Email này đã tồn tại",
    })
    return;
  }
  const salt = await bcrypt.genSaltSync(10);
  const hashpassword = bcrypt.hashSync(password, salt);
  const newAccount=new accountmodel({
    fullname:fullname,
    email:email,
    password:hashpassword,
    status:status,
  });
  await newAccount.save();
  res.json({
    code:"success",
    message:"Đăng ký thành công",
  })
}

module.exports.loginPost=async(req,res)=>{  
  const {email,password}=req.body;
  const emailList=await accountmodel.find({email:email});
  if(emailList.length==0){
    res.json({
      code:"error",
      message:"Không tìm thấy email của bạn",
    })
    return;
  }
  else{
    if(emailList[0].status=="pending"){
      res.json({
        code:"error",
        message:"Tài khoản bạn chưa được duyệt"
      });
      return;
    }
    if(emailList[0].status=="blocked"){
      res.json({
        code:"error",
        message:"Tài khoản bạn đã bị khoá"
      });
      return;
    }
    if(emailList[0].status=="active"){
      if(await bcrypt.compare(password, emailList[0].password)){
        const token = jwt.sign({
          email:emailList[0].email,
          id:emailList[0].id,
        }, process.env.COOKIE_ACCOUNT
        ,{ expiresIn: "1d" });
        res.cookie("loginID",token,{
          maxAge:1*24*60*60*1000,
          httpOnly:true,
        })
        res.json({
          code:"success",
          message:"Đăng nhập thành công"
        });
        return;
      }      
      res.json({
        code:"error",
        message:"Mật khẩu không chính xác",
      })
      return;
    }
    res.json({
      code:"error",
      message:"Đăng nhập không thành công"
    });
    
  }
  
}


module.exports.forgotpassword=async(req, res)=>{
  res.render('admin/pages/forgot-password.pug',{title:"Trang quên mật khẩu"})
}

module.exports.enterOTP=async(req, res)=>{
  res.render('admin/pages/enter-otp.pug',{title:"Trang nhập mã OTP"})
}

module.exports.resetpassword=async(req, res)=>{
  res.render('admin/pages/reset-password.pug',{title:"Trang đổi mật khẩu"})
}