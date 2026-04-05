module.exports.cartController=async(req,res)=>{
  console.log("Trang giở hàng");
  res.render('pages/client/cart.pug',{title:"Giỏ hàng"});
}