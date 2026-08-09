const router=require('express').Router();
const settingController=require("../../controllers/admin/setting.controller.js");
const settingValidate=require("../../validates/admin/setting.validate.js");

const multer  = require('multer');
const {storage}=require("../../helpers/cloudinary.helper.js");
const parser = multer({ storage: storage });


router.get("/",settingController.list);

router.get("/website-infor",settingController.websiteInfor);
router.post(
  "/website-infor",
  parser.fields([{ name: 'avatar', maxCount: 1 }, { name: 'favicon', maxCount: 1 }]),
  settingController.websiteInforPost
);

router.get("/account-admin/list",settingController.accountAdminList);

router.get("/account-admin/create",settingController.accountAdminCreate);
router.post(
  "/account-admin/create",
  parser.single("avatar"),
  settingValidate.settingAccountCreate,
  settingController.accountAdminCreatePost
);

router.get("/account-admin/edit/:id",settingController.accountAdminEdit);
router.patch(
  "/account-admin/edit/:id",
  parser.single("avatar"),
  settingValidate.settingAccountEdit,
  settingController.accountAdminEditPatch
);


router.get("/role/list",settingController.roleList);
router.patch("/role/list",settingController.roleListPatch);
router.post("/role/list/delete",settingController.deletePost);

router.get("/role/create",settingController.roleCreate);
router.post("/role/create",settingValidate.roleCreate,settingController.roleCreatePost);

router.get("/role/edit/:id",settingController.roleEdit);
router.patch("/role/edit/:id",settingController.roleEditPatch);

router.get("/client/homepage",settingController.clientHomepage);
router.patch("/client/homepage",parser.none(),settingController.clientHomepagePatch);


module.exports=router;
