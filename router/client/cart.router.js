const router=require('express').Router();
const cartController=require("../../controllers/client/cart.controller.js");
const orderValidate=require("../../validates/admin/order.validate.js");

router.get('/', cartController.cart);
router.post('/', cartController.getData);



module.exports=router;