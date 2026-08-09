const router=require('express').Router();
const tourController=require("../../controllers/admin/tour.controller.js");
const tourValidate=require("../../validates/admin/tour.validate.js");
const {checkPermission}=require("../../middlewares/admin/checkPermission.middleware.js")

const multer  = require('multer')
const {storage}=require("../../helpers/cloudinary.helper.js");
const parser = multer({ storage: storage });

router.get("/manage", tourController.manage);
router.patch(
  "/applyPatch",
  checkPermission(["edit-tour","delete-tour"]),
  tourController.applyPatch
);

router.get("/create", tourController.create);
router.post(
  "/create", 
  checkPermission(["create-tour"]),
  parser.fields([{ name: 'avatar', maxCount: 1 }, { name: 'images', maxCount: 20 }]),
  tourValidate.createValidate, 
  tourController.createPost
);

router.post(
  "/delete",
  checkPermission(["delete-tour"]),
  tourController.deletePost
);

router.get("/edit/:id", tourController.edit);
router.patch(
  "/edit/:id",
  checkPermission(["edit-tour"]),
  parser.fields([{ name: 'avatar', maxCount: 1 }, { name: 'images', maxCount: 20 }]),
  tourValidate.createValidate,  
  tourController.editPatch
);


router.get(
  "/rubbish",
  tourController.rubbish
);
router.patch(
  "/rubbish/restore",
  checkPermission(["rubbish-tour"]), 
  tourController.rubbishRestore
);
router.patch(
  "/rubbish/forever-delete", 
  checkPermission(["rubbish-tour"]), 
  tourController.foreverDelete
);
router.patch(
  "/rubbish/apply", 
  checkPermission(["rubbish-tour"]), 
  tourController.rubbishApplyPatch
);

module.exports=router;
