const router=require('express').Router();
//controller
const TourController=require("../../controllers/client/Tour.controller.js");

router.get('/list', TourController.tourList);
router.get('/detail', TourController.tourDetail);

module.exports = router;