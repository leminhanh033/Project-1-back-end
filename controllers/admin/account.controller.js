module.exports.login=async(req, res)=>{
  res.render('admin/pages/login.pug',{title:"Trang đăng nhập"})
}

module.exports.register=async(req, res)=>{
  res.render('admin/pages/register.pug',{title:"Trang đăng ký"})
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