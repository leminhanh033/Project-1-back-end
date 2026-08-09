const router=require('express').Router();
const userController=require("../../controllers/admin/user.controller.js");

const {checkPermission}=require("../../middlewares/admin/checkPermission.middleware.js")

router.get("/manage",userController.manage);

router.get("/connect",userController.connect);
router.patch(
  "/connect/applyPatch",
  checkPermission(["delete-infor-contact"]),
  userController.applyPatch
);
router.post(
  "/connect/delete",
  checkPermission(["delete-infor-contact"]),
  userController.delete
);

module.exports=router;
