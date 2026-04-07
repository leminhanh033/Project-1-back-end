const router=require('express').Router();
const orderController=require("../../controllers/admin/order.controller.js");

router.get("/manage", orderController.manage);
router.get("/edit", orderController.edit);

module.exports=router;
