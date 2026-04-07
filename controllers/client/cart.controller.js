module.exports.cartController=async(req,res)=>{
  console.log("Trang giở hàng");
  res.render('client/pages/cart.pug',{title:"Giỏ hàng"});
}