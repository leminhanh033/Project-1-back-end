const router=require('express').Router();
//Router
const tourRouter=require("./Tour.router.js");
const homepage=require("./homepage.router.js");
const cartRouter=require("./cart.router.js");

router.use('/', homepage);
router.use('/tour', tourRouter);
router.use('/cart',cartRouter);

module.exports=router;