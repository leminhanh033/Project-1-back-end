const router=require('express').Router();
const profileController=require("../../controllers/admin/profile.controller.js");
const profileValidate=require("../../validates/admin/profile.validate.js")

const multer  = require('multer')
const {storage}=require("../../helpers/cloudinary.helper.js");

const parser = multer({ storage: storage });

router.get("/",profileController.edit);
router.patch("/",parser.single("avatar"),profileValidate.accountEdit,profileController.editPatch);

router.get("/change-password",profileController.changePassword);
router.patch("/change-password",profileValidate.changePassword,profileController.changePasswordPatch);

module.exports=router;
