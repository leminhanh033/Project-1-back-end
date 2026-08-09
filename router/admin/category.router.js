const router=require("express").Router();
const categoryController=require("../../controllers/admin/category.controller.js");
const multer  = require('multer')
const {storage}=require("../../helpers/cloudinary.helper.js");
const categoryValidate=require("../../validates/admin/category.validate");
const {checkPermission}=require("../../middlewares/admin/checkPermission.middleware.js");

const parser = multer({
  storage,
});

router.get("/manage",categoryController.manage);

router.get("/create",categoryController.create);
router.post(
  "/create", 
  checkPermission(["create-category"]),
  parser.single('avatar'),
  categoryValidate.createValidate,
  categoryController.createPost
);

router.get("/edit/:id",categoryController.edit);
router.patch(
  "/edit/:id",
  checkPermission(["edit-category"]),
  parser.single('avatar'),
  categoryValidate.createValidate,
  categoryController.editPatch
);

router.post("/delete",categoryController.deletePost)

router.patch("/applyPatch",categoryController.applyPatch)

module.exports=router;