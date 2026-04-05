
module.exports.HomepageController=async(req, res) => {

  console.log ("Trang chủ");
  res.render('pages/client/homepage',{title:"Trang chủ"});

}
