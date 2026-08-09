const router=require('express').Router();
//controller
const categoryController=require("../../controllers/client/category.controller.js");

const {settingListTour}=require("../../middlewares/client/setting.middleware.js");

router.get('/:slug',settingListTour, categoryController.category);

module.exports = router;