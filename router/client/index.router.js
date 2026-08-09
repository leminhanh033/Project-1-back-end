const router=require('express').Router();
//Router
const tourRouter=require("./Tour.router.js");
const categoryRouter=require("./category.router.js");
const searchRouter=require("./search.router.js");
const homepage=require("./homepage.router.js");
const cartRouter=require("./cart.router.js");
const orderRouter=require("./order.router.js");

const {setting}=require("../../middlewares/client/setting.middleware.js");
const {headerFooter}=require("../../middlewares/client/headerFooter.middleware.js");

router.use('/', headerFooter,setting,homepage);
router.use('/tour',headerFooter,setting, tourRouter);
router.use('/category',headerFooter,categoryRouter);
router.use('/search',headerFooter,searchRouter);
router.use('/cart',headerFooter,setting,cartRouter);
router.use('/order',headerFooter,setting,orderRouter);

module.exports=router;