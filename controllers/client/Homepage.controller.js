
module.exports.HomepageController=async(req, res) => {

  console.log ("Trang chủ");
  res.render('client/pages/homepage',{title:"Trang chủ"});

}
