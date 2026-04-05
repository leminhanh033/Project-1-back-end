const router=require('express').Router();
const {cartController}=require("../../controllers/client/cart.controller.js");

router.get('/', cartController);

module.exports=router;