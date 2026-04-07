//model
const {Tour}=require("../../models/client/Tour.model.js");

module.exports.tourList=async(req, res) => {

  console.log("Danh sách tour");
  res.render('client/pages/tourlist',{title:"Danh sách tour"});

}

module.exports.tourDetail=async(req,res)=>{
  console.log("Chi tiết tour");
  res.render('client/pages/tourdetail.pug',{title:"Chi tiết tour"});
}