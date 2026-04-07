const router=require('express').Router();
const userController=require("../../controllers/admin/user.controller.js");

router.get("/manage",userController.manage);
router.get("/connect",userController.connect);

module.exports=router;
