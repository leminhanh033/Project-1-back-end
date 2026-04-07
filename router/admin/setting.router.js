const router=require('express').Router();
const settingController=require("../../controllers/admin/setting.controller.js");

router.get("/",settingController.list);
router.get("/website-infor",settingController.websiteInfor);
router.get("/account-admin/list",settingController.accountAdminList);
router.get("/account-admin/create",settingController.accountAdminCreate);
router.get("/role/list",settingController.roleList);
router.get("/role/create",settingController.roleCreate);

module.exports=router;
