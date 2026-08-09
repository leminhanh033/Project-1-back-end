const router=require('express').Router();

const account=require("./account.router.js");
const dashboard=require("./dashboard.router.js");
const category=require("./category.router.js");
const tour=require("./tour.router.js");
const order=require("./order.router.js");
const user=require("./user.router.js");
const setting=require("./setting.router.js");
const profile=require("./profile.router.js");
const upload=require("./upload.router.js")

const {checkLogin}=require("../../middlewares/admin/checkLogin.middleware.js");

router.use("/account",account);
router.use("/dashboard",checkLogin,dashboard);
router.use("/category",checkLogin,category);
router.use ("/tour",checkLogin,tour);
router.use ("/order",checkLogin,order);
router.use ("/user",checkLogin,user);
router.use ("/setting",checkLogin,setting);
router.use("/profile",checkLogin,profile);
router.use("/upload",checkLogin,upload);

router.use((req,res)=>{
  res.render("admin/pages/404-not-found",{title:"404 Not Found"});
})

module.exports=router;