const router=require('express').Router();

const account=require("./account.router.js");
const dashboard=require("./dashboard.router.js");
const category=require("./category.router.js");
const tour=require("./tour.router.js");
const order=require("./order.router.js");
const user=require("./user.router.js");
const setting=require("./setting.router.js");
const profile=require("./profile.router.js");

router.use("/account",account);
router.use("/dashboard",dashboard);
router.use("/category",category);
router.use ("/tour",tour);
router.use ("/order",order);
router.use ("/user",user);
router.use ("/setting",setting);
router.use("/profile",profile);

router.use((req,res)=>{
  res.render("admin/pages/404-not-found",{title:"404 Not Found"});
})

module.exports=router;