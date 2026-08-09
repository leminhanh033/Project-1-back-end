const router=require('express').Router();
//controller
const TourController=require("../../controllers/client/Tour.controller.js");

router.get('/detail/:slug', TourController.tourDetail);

module.exports = router;