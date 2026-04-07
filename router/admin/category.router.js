const router=require("express").Router();
const categoryController=require("../../controllers/admin/category.controller.js");

router.get("/manage",categoryController.manage);
router.get("/create",categoryController.create);

module.exports=router;