const router=require('express').Router();
const orderController=require("../../controllers/admin/order.controller.js");

router.get("/manage", orderController.manage);

router.get("/edit/:code", orderController.edit);
router.post("/edit", orderController.editPost);
router.post("/delete", orderController.deletePost);

module.exports=router;
