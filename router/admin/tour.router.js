const router=require('express').Router();
const tourController=require("../../controllers/admin/tour.controller.js");

router.get("/manage", tourController.manage);
router.get("/create", tourController.create);
router.get("/rubbish", tourController.rubbish);

module.exports=router;
