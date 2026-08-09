const accountmodel=require("../../models/admin/account.model.js");
const otp=require("../../models/admin/otp.model.js");
const {otpCreate}=require("../../helpers/otp.helper.js");
const {sendMail}=require("../../helpers/sendMail.helper.js");
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
    deleted:false,
  });
  await newAccount.save();
  res.json({
    code:"success",
    message:"Đăng ký thành công",
  })
}

module.exports.loginPost=async(req,res)=>{  
  const {email,password,rememberpassword}=req.body;
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
          maxAge:rememberpassword?7*24*60*60*1000:1*24*60*60*1000,
          httpOnly:true,
          sameSite: "strict",
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

module.exports.forgotpasswordPOST=async(req, res)=>{
  const useremail=req.body.email;
  const account=await accountmodel.findOne({
    email:useremail,
  });
  const otpNumber=otpCreate();
  if(account){
    const sentEmail=await otp.findOne({
      email:useremail,
    })
    if(sentEmail){
      otp.findOneAndDelete({
        email:useremail,
      })
    }
    const subject="Mã xác nhận OTP";
    sendMail(useremail,subject,otpNumber);
    const otpinfor={
      email:useremail,
      otp:otpNumber,
      expireAt:Date.now()+5*60*1000,
    }
    const otpSend=new otp(otpinfor);
    await otpSend.save();
    res.json({
      code:"success",
      message:"Email hợp lệ"
    })
  }
  else{
    res.json({
      code:"error",
      message:"Không tìm thấy email"
    })
  }
}

module.exports.enterOTP=async(req, res)=>{
  res.render('admin/pages/enter-otp.pug',{title:"Trang nhập mã OTP"})
}

module.exports.enterOTPPOST=async(req, res)=>{
  const otpinfor=await otp.findOne(req.body);
  if(otpinfor){
    await otp.findOneAndDelete(req.body);
    const email=req.body.email;
    const existAccount=await accountmodel.findOne({
      email:email,
    });
    if(!existAccount){
      res.json({
        code:"error",
        message:"email không chính xác",
      });
      return;
    }
    const token= jwt.sign({ 
      email:email,
      id:existAccount.id,
     }, process.env.COOKIE_ACCOUNT,{
      expiresIn: '1d',
     });
    res.cookie('loginID', token, {
      maxAge:1*24*60*60*1000,
      httpOnly:true,
      sameSite: "strict",
});
    res.json({
      code:"success",
      message:"Nhập mã OTP thành công",
    })
  }
  else{
    res.json({
      code:"error",
      message:"Mã OTP không chính xác",
    })
  }
}


module.exports.resetpassword=async(req, res)=>{
  res.render('admin/pages/reset-password.pug',{title:"Trang đổi mật khẩu"})
}

module.exports.resetpasswordPost=async(req,res)=>{
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);
  await accountmodel.updateOne({
    _id:req.account.id,
  },{
    password:hash,
  })
  res.json({
    code:"success",
    message:"Thay đổi mật khẩu thành công"
  })
}


module.exports.logoutPost=async(req,res)=>{
  res.clearCookie("loginID");
  res.json({
    code:"success",
    message:"Đăng xuất thành công"
  })
}