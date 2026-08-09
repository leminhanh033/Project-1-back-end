
const emailForInformodel=require("../../models/client/emailForInfor.model");

module.exports.Homepage=async(req, res) => {
  res.render('client/pages/homepage',{
    title:"Trang chủ"
  });
}

module.exports.emailForInfor=async(req,res)=>{
  try{
    const newEmail=new emailForInformodel(req.body);
    await newEmail.save();
    res.json({
      code:"success",
      message:"Email bạn sẽ nhận được thông báo mới nhất",
    })
  }
  catch(error){
    console.log(error);
    res.json({
      code:'error',
      message:"Đã xảy ra lỗi"
    })
  }
}
