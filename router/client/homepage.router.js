const router=require('express').Router();
//controller
const {HomepageController}=require("../../controllers/client/Homepage.controller.js");

router.get('/', HomepageController);

module.exports = router;